import { TRANSLATIONS } from '../hooks/useTranslate/constants'
import { SessionConfiguration } from '../features/SessionTemplates/types'

import { ChromeKeys, Language } from './enums'

export type StateTimer = {
  isActive: boolean
  isPause: boolean
  blockedDomains?: string[]
}

export type Locale = (typeof TRANSLATIONS)[Language.EN]

export type TimePeriod = {
  activityName: string
  startDate: number
  endDate: number
  dayOfWeek: number
  totalTimeForSession: number
  mood: string
  domainSessions?: SessionsDomainInfo[]
  focusScore?: number
  note?: string
  pauseCount?: number
  sessionConfiguration?: SessionConfiguration
}

export type StudyStreak = {
  currentStreak: number
  bestStreak: number
  isRecoveryDayUsed: boolean
}

export interface ChromeStorageProps {
  [ChromeKeys.CHROME_STATE_TIMER]: StateTimer
}

export type NotificationSettingState = {
  isNotificationActive: boolean
  periodInMinutes: number
}

export type SessionsDomainInfo = {
  domain: string
  fullDomain: string
  duration: number
  endTime: string
  startTime: string
}
