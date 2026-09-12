import { SessionsDomainInfo } from '../../types'
import { TimePeriod } from '../../types'

import {
  SessionDomainSummary,
  SessionSummary,
  SessionSummaryInput,
} from './types'

const TARGET_SESSION_SECONDS = 25 * 60
const RECENT_SESSION_COUNT = 5

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum)
}

function normalizeDomain(domain: string): string {
  return domain.replace(/^www\./, '').toLowerCase()
}

function getOverlappingDuration(
  domainSession: SessionsDomainInfo,
  sessionStart: number,
  sessionEnd: number,
): number {
  const domainStart = new Date(domainSession.startTime).getTime()
  const domainEnd = new Date(domainSession.endTime).getTime()

  if (!Number.isFinite(domainStart) || !Number.isFinite(domainEnd)) return 0

  return Math.max(
    0,
    Math.min(domainEnd, sessionEnd) - Math.max(domainStart, sessionStart),
  )
}

export function getSessionDomainData(
  session: TimePeriod,
  domainSessions: SessionsDomainInfo[],
): SessionsDomainInfo[] {
  return domainSessions.filter(
    domainSession =>
      getOverlappingDuration(
        domainSession,
        session.startDate,
        session.endDate,
      ) > 0,
  )
}

function getDomainSummaries({
  session,
  domainSessions,
  distractingDomains,
}: SessionSummaryInput): SessionDomainSummary[] {
  const distractingDomainSet = new Set(distractingDomains.map(normalizeDomain))
  const durationByDomain = new Map<string, number>()

  domainSessions.forEach(domainSession => {
    const duration = getOverlappingDuration(
      domainSession,
      session.startDate,
      session.endDate,
    )

    if (!duration) return

    const domain = normalizeDomain(domainSession.domain)

    durationByDomain.set(domain, (durationByDomain.get(domain) || 0) + duration)
  })

  return Array.from(durationByDomain.entries())
    .map(([domain, duration]) => ({
      domain,
      durationSeconds: Math.round(duration / 1000),
      isDistracting: distractingDomainSet.has(domain),
    }))
    .sort(
      (firstDomain, secondDomain) =>
        secondDomain.durationSeconds - firstDomain.durationSeconds,
    )
}

function getFocusLevel(score: number): SessionSummary['focusLevel'] {
  if (score >= 85) return 'excellent'

  if (score >= 75) return 'good'

  if (score >= 50) return 'mixed'

  return 'low'
}

function getRegularityScore(input: SessionSummaryInput): number {
  const recentDurations = input.history
    .filter(session => session.totalTimeForSession > 0)
    .slice(-RECENT_SESSION_COUNT)
    .map(session => session.totalTimeForSession)

  if (!recentDurations.length) return 10

  const averageDuration =
    recentDurations.reduce((total, duration) => total + duration, 0) /
    recentDurations.length
  const differenceRatio =
    Math.abs(input.session.totalTimeForSession - averageDuration) /
    averageDuration

  return 10 * Math.max(0, 1 - differenceRatio)
}

function getFocusScore(
  input: SessionSummaryInput,
  distractingTimeSeconds: number,
  domainTimeAvailable: boolean,
): number {
  const durationScore =
    clamp(input.session.totalTimeForSession / TARGET_SESSION_SECONDS, 0, 1) * 20
  const moodScore = clamp(Number(input.session.mood) || 3, 1, 5) * 4
  const distractionRatio = clamp(
    distractingTimeSeconds / Math.max(input.session.totalTimeForSession, 1),
    0,
    1,
  )
  const distractionScore = domainTimeAvailable
    ? (1 - distractionRatio) * 35
    : 35
  const pauseScore = Math.max(0, 15 - (input.session.pauseCount || 0) * 3)

  return Math.round(
    durationScore +
      moodScore +
      distractionScore +
      pauseScore +
      getRegularityScore(input),
  )
}

function getFactors(
  input: SessionSummaryInput,
  distractingTimeSeconds: number,
  domainTimeAvailable: boolean,
): SessionSummary['factors'] {
  const factors: SessionSummary['factors'] = []
  const distractionRatio =
    distractingTimeSeconds / Math.max(input.session.totalTimeForSession, 1)
  const mood = Number(input.session.mood) || 3

  if (input.session.totalTimeForSession < 5 * 60) {
    factors.push({ key: 'shortSession', type: 'negative' })
  }

  if (domainTimeAvailable && distractionRatio < 0.2) {
    factors.push({ key: 'productiveTime', type: 'positive' })
  }

  if (mood >= 4) factors.push({ key: 'mood', type: 'positive' })

  if (mood <= 2) factors.push({ key: 'mood', type: 'negative' })

  if (distractingTimeSeconds > 0) {
    factors.push({ key: 'distractions', type: 'negative' })
  }

  if ((input.session.pauseCount || 0) > 0) {
    factors.push({ key: 'pauses', type: 'negative' })
  }

  if (input.history.length > 0) {
    factors.push({
      key: 'regularity',
      type: getRegularityScore(input) >= 7 ? 'positive' : 'negative',
    })
  }

  return factors
}

function getComparison(
  history: SessionSummaryInput['history'],
  focusScore: number,
): SessionSummary['comparison'] {
  const recentScores = history
    .map(session => session.focusScore)
    .filter((score): score is number => typeof score === 'number')
    .slice(-RECENT_SESSION_COUNT)

  if (!recentScores.length) {
    return { previousSessionDelta: null, recentAverageDelta: null }
  }

  const recentAverage = Math.round(
    recentScores.reduce((total, score) => total + score, 0) /
      recentScores.length,
  )

  return {
    previousSessionDelta: focusScore - recentScores[recentScores.length - 1],
    recentAverageDelta: focusScore - recentAverage,
  }
}

function getRecommendation(
  input: SessionSummaryInput,
  domains: SessionDomainSummary[],
  distractingTimeSeconds: number,
): SessionSummary['recommendation'] {
  const distractingRatio =
    distractingTimeSeconds / Math.max(input.session.totalTimeForSession, 1)
  const topDistractingDomain = domains.find(domain => domain.isDistracting)

  if (topDistractingDomain && distractingRatio >= 0.15) {
    return {
      type: 'reduceDistractions',
      domain: topDistractingDomain.domain,
      minutes: 25,
    }
  }

  if (Number(input.session.mood) <= 2 || (input.session.pauseCount || 0) >= 3) {
    return { type: 'takeBreak', minutes: 20 }
  }

  if (input.session.totalTimeForSession < TARGET_SESSION_SECONDS) {
    return { type: 'buildRoutine', minutes: 25 }
  }

  return {
    type: 'continue',
    minutes: Math.max(
      25,
      Math.round(input.session.totalTimeForSession / 300) * 5,
    ),
  }
}

export function createSessionSummary(
  input: SessionSummaryInput,
): SessionSummary {
  const domains = getDomainSummaries(input)
  const distractingTimeSeconds = domains
    .filter(domain => domain.isDistracting)
    .reduce((total, domain) => total + domain.durationSeconds, 0)
  const domainTimeAvailable = domains.length > 0
  const focusScore = getFocusScore(
    input,
    distractingTimeSeconds,
    domainTimeAvailable,
  )

  return {
    comparison: getComparison(input.history, focusScore),
    domainTimeAvailable,
    domains,
    distractingTimeSeconds,
    factors: getFactors(input, distractingTimeSeconds, domainTimeAvailable),
    focusLevel: getFocusLevel(focusScore),
    focusScore,
    productiveTimeSeconds: Math.max(
      input.session.totalTimeForSession - distractingTimeSeconds,
      0,
    ),
    recommendation: getRecommendation(input, domains, distractingTimeSeconds),
  }
}
