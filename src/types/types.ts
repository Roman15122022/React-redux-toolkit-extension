import { TRANSLATIONS } from '../hooks/useTranslate/constants'

import { Language } from './enums'

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
}
