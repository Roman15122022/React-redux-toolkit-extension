import { TimePeriod } from '../../types'

import {
  AIRecommendationType,
  AIPrediction,
  TrainingExample,
  TrainingSource,
} from './types'
import {
  MAX_DURATION_SECONDS,
  MAX_RECENT_SESSIONS,
  MAX_SESSIONS_PER_DAY,
  MIN_TRAINING_SESSIONS,
  MS_IN_DAY,
  TRAINING_SESSION_STEP,
} from './constants'

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function getSafeMood(mood: string): number {
  return clamp(Number(mood) || 3, 1, 5)
}

function getSessionDayKey(session: TimePeriod): string {
  return new Date(session.startDate).toDateString()
}

function getDayOfWeek(session: TimePeriod): number {
  if (session.dayOfWeek) return clamp(session.dayOfWeek, 1, 7)

  const nativeDay = new Date(session.startDate).getDay()

  return nativeDay === 0 ? 1 : nativeDay + 1
}

function getSessionDuration(session: TimePeriod): number {
  return clamp(session.totalTimeForSession || 0, 0, MAX_DURATION_SECONDS)
}

function getSessionStartHour(session: TimePeriod): number {
  return new Date(session.startDate).getHours()
}

function getAverage(values: number[]): number {
  if (!values.length) return 0

  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function getStandardDeviation(values: number[]): number {
  if (values.length <= 1) return 0

  const average = getAverage(values)
  const variance = getAverage(values.map(value => Math.pow(value - average, 2)))

  return Math.sqrt(variance)
}

function getSessionsOnTargetDay(
  sessions: TimePeriod[],
  target: TimePeriod,
): number {
  const targetDay = getSessionDayKey(target)

  return sessions.filter(session => getSessionDayKey(session) === targetDay)
    .length
}

function getRecentSessionRate(
  sessions: TimePeriod[],
  currentIndex: number,
): number {
  const currentSession = sessions[currentIndex]
  const startWindow = currentSession.startDate - MS_IN_DAY * 7
  const recentSessions = sessions
    .slice(0, currentIndex + 1)
    .filter(session => session.startDate >= startWindow)

  return clamp(recentSessions.length / MAX_RECENT_SESSIONS, 0, 1)
}

function getRecentSessions(sessions: TimePeriod[], count = 7): TimePeriod[] {
  return sessions.slice(Math.max(sessions.length - count, 0))
}

function getRecentLowMoodRiskPercent(sessions: TimePeriod[]): number {
  const recentSessions = getRecentSessions(sessions)

  if (!recentSessions.length) return 50

  const lowMoodCount = recentSessions.filter(
    session => getSafeMood(session.mood) <= 2,
  ).length

  return Math.round((lowMoodCount / recentSessions.length) * 100)
}

function getAverageRecoveryHours(sessions: TimePeriod[]): number {
  if (sessions.length <= 1) return 24

  const gaps = sessions.slice(1).map((session, index) => {
    const previousSession = sessions[index]

    return Math.max(
      0,
      (session.startDate - previousSession.endDate) / (60 * 60 * 1000),
    )
  })

  return getAverage(gaps)
}

export function getCompletedSessions(dates: TimePeriod[]): TimePeriod[] {
  return dates
    .filter(
      session =>
        Boolean(session.startDate) &&
        Boolean(session.endDate) &&
        session.totalTimeForSession > 0,
    )
    .sort((a, b) => a.startDate - b.startDate)
}

export function getTrainingBoundary(sessionCount: number): number {
  return (
    Math.floor(sessionCount / TRAINING_SESSION_STEP) * TRAINING_SESSION_STEP
  )
}

export function getTrainingSource(dates: TimePeriod[]): TrainingSource {
  const sessions = getCompletedSessions(dates)
  const boundary = getTrainingBoundary(sessions.length)

  return {
    sessions: sessions.slice(0, boundary),
    boundary,
  }
}

export function getNeededSessions(sessionCount: number): number {
  if (sessionCount >= MIN_TRAINING_SESSIONS) return 0

  return MIN_TRAINING_SESSIONS - sessionCount
}

export function createInputFeatures(
  sessions: TimePeriod[],
  index: number,
): number[] {
  const session = sessions[index]
  const startHour = new Date(session.startDate).getHours()

  return [
    getDayOfWeek(session) / 7,
    startHour / 23,
    getSessionDuration(session) / MAX_DURATION_SECONDS,
    getSafeMood(session.mood) / 5,
    getRecentSessionRate(sessions, index),
  ]
}

export function createOutputValues(
  sessions: TimePeriod[],
  target: TimePeriod,
): number[] {
  return [
    getSafeMood(target.mood) / 5,
    getSessionDuration(target) / MAX_DURATION_SECONDS,
    clamp(getSessionsOnTargetDay(sessions, target), 1, MAX_SESSIONS_PER_DAY) /
      MAX_SESSIONS_PER_DAY,
    getSafeMood(target.mood) <= 2 ? 1 : 0,
  ]
}

export function createTrainingExamples(
  sessions: TimePeriod[],
): TrainingExample[] {
  const examples: TrainingExample[] = []

  for (let index = 0; index < sessions.length - 1; index++) {
    examples.push({
      input: createInputFeatures(sessions, index),
      output: createOutputValues(sessions, sessions[index + 1]),
    })
  }

  return examples
}

export function getRecommendationType(
  mood: number,
  studyTimeSeconds: number,
  badMoodRiskPercent = 0,
  fatigueScorePercent = 0,
): AIRecommendationType {
  if (mood <= 2 || fatigueScorePercent >= 70 || badMoodRiskPercent >= 70) {
    return 'rest'
  }

  if (studyTimeSeconds < 30 * 60) return 'shortSession'

  if (mood >= 4 && studyTimeSeconds >= 60 * 60) return 'increase'

  return 'steady'
}

export function getFatigueScorePercent(dates: TimePeriod[]): number {
  const sessions = getCompletedSessions(dates)
  const recentSessions = getRecentSessions(sessions)

  if (recentSessions.length < 2) return 0

  const averageDuration = getAverage(
    recentSessions.map(session => getSessionDuration(session)),
  )
  const averageMood = getAverage(
    recentSessions.map(session => getSafeMood(session.mood)),
  )
  const firstHalfMood = getAverage(
    recentSessions
      .slice(0, Math.ceil(recentSessions.length / 2))
      .map(session => getSafeMood(session.mood)),
  )
  const secondHalfMood = getAverage(
    recentSessions
      .slice(Math.floor(recentSessions.length / 2))
      .map(session => getSafeMood(session.mood)),
  )
  const moodDropScore = clamp((firstHalfMood - secondHalfMood) / 2, 0, 1)
  const loadScore = clamp(averageDuration / (2 * 60 * 60), 0, 1)
  const moodScore = clamp((5 - averageMood) / 4, 0, 1)
  const recoveryScore = clamp(
    (12 - getAverageRecoveryHours(recentSessions)) / 12,
    0,
    1,
  )

  return Math.round(
    (loadScore * 0.35 +
      moodScore * 0.25 +
      recoveryScore * 0.25 +
      moodDropScore * 0.15) *
      100,
  )
}

export function getConsistencyScorePercent(dates: TimePeriod[]): number {
  const sessions = getCompletedSessions(dates)
  const recentSessions = getRecentSessions(sessions, 14)

  if (recentSessions.length < 2) return 0

  const uniqueDays = new Set(recentSessions.map(getSessionDayKey)).size
  const firstStartDate = recentSessions[0].startDate
  const lastStartDate = recentSessions[recentSessions.length - 1].startDate
  const coveredDays = Math.max(
    1,
    Math.ceil((lastStartDate - firstStartDate) / MS_IN_DAY) + 1,
  )
  const regularityScore = clamp(uniqueDays / Math.min(coveredDays, 14), 0, 1)
  const startHourScore =
    1 -
    clamp(
      getStandardDeviation(recentSessions.map(getSessionStartHour)) / 8,
      0,
      1,
    )
  const durationScore =
    1 -
    clamp(
      getStandardDeviation(recentSessions.map(getSessionDuration)) /
        MAX_DURATION_SECONDS,
      0,
      1,
    )

  return Math.round(
    (regularityScore * 0.45 + startHourScore * 0.3 + durationScore * 0.25) *
      100,
  )
}

export function normalizePrediction(
  rawValues: number[],
  sessions: TimePeriod[] = [],
): AIPrediction {
  const [rawMood = 0.6, rawTime = 0.2, rawSessions = 0.2, rawBadMood = 0.5] =
    rawValues
  const mood = clamp(Math.round(rawMood * 5), 1, 5)
  const studyTimeSeconds = Math.max(
    5 * 60,
    Math.round(clamp(rawTime, 0, 1) * MAX_DURATION_SECONDS),
  )
  const sessionCount = clamp(
    Math.round(clamp(rawSessions, 0, 1) * MAX_SESSIONS_PER_DAY),
    1,
    MAX_SESSIONS_PER_DAY,
  )
  const badMoodRiskPercent = Math.round(clamp(rawBadMood, 0, 1) * 100)
  const fatigueScorePercent = getFatigueScorePercent(sessions)
  const consistencyScorePercent = getConsistencyScorePercent(sessions)

  return {
    mood,
    studyTimeSeconds,
    sessionCount,
    badMoodRiskPercent,
    fatigueScorePercent,
    consistencyScorePercent,
    recommendation: getRecommendationType(
      mood,
      studyTimeSeconds,
      badMoodRiskPercent,
      fatigueScorePercent,
    ),
  }
}

export function getFallbackPrediction(dates: TimePeriod[]): AIPrediction {
  const sessions = getCompletedSessions(dates)

  if (!sessions.length) {
    return {
      mood: 3,
      studyTimeSeconds: 45 * 60,
      sessionCount: 1,
      badMoodRiskPercent: 50,
      fatigueScorePercent: 0,
      consistencyScorePercent: 0,
      recommendation: 'steady',
    }
  }

  const totalMood = sessions.reduce(
    (sum, session) => sum + getSafeMood(session.mood),
    0,
  )
  const totalDuration = sessions.reduce(
    (sum, session) => sum + getSessionDuration(session),
    0,
  )
  const latestSession = sessions[sessions.length - 1]

  const mood = clamp(Math.round(totalMood / sessions.length), 1, 5)
  const studyTimeSeconds = Math.max(
    5 * 60,
    Math.round(totalDuration / sessions.length),
  )
  const sessionCount = clamp(
    getSessionsOnTargetDay(sessions, latestSession),
    1,
    MAX_SESSIONS_PER_DAY,
  )
  const badMoodRiskPercent = getRecentLowMoodRiskPercent(sessions)
  const fatigueScorePercent = getFatigueScorePercent(sessions)
  const consistencyScorePercent = getConsistencyScorePercent(sessions)

  return {
    mood,
    studyTimeSeconds,
    sessionCount,
    badMoodRiskPercent,
    fatigueScorePercent,
    consistencyScorePercent,
    recommendation: getRecommendationType(
      mood,
      studyTimeSeconds,
      badMoodRiskPercent,
      fatigueScorePercent,
    ),
  }
}
