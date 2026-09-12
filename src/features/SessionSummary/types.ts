import { SessionsDomainInfo, TimePeriod } from '../../types'

export type SessionSummaryInput = {
  session: TimePeriod
  history: TimePeriod[]
  domainSessions: SessionsDomainInfo[]
  distractingDomains: string[]
}

export type SessionDomainSummary = {
  domain: string
  durationSeconds: number
  isDistracting: boolean
}

export type SessionSummary = {
  comparison: {
    previousSessionDelta: number | null
    recentAverageDelta: number | null
  }
  domainTimeAvailable: boolean
  domains: SessionDomainSummary[]
  distractingTimeSeconds: number
  factors: Array<{
    key:
      | 'distractions'
      | 'mood'
      | 'pauses'
      | 'productiveTime'
      | 'regularity'
      | 'shortSession'
    type: 'negative' | 'positive'
  }>
  focusLevel: 'excellent' | 'good' | 'low' | 'mixed'
  focusScore: number
  productiveTimeSeconds: number
  recommendation: {
    type: 'buildRoutine' | 'continue' | 'reduceDistractions' | 'takeBreak'
    domain?: string
    minutes: number
  }
}
