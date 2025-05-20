import { TRANSLATIONS } from '../hooks/useTranslate/constants'

import { ChromeKeys, Language } from './enums'

export type StateTimer = {
  isActive: boolean
  isPause: boolean
}

export type Locale = (typeof TRANSLATIONS)[Language.EN]

export type TimePeriod = {
  activityName: string
  startDate: number
  endDate: number
  dayOfWeek: number
  totalTimeForSession: number
  mood: string
}

export interface ChromeStorageProps {
  [ChromeKeys.CHROME_STATE_TIMER]: { isActive: boolean; isPause: boolean }
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
