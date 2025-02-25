import { TimePeriod } from '../../../types'

export interface TimerLogs {
  dates: TimePeriod[]
  lastStartDate: number
  lastMood: string
  lastNameActivity: string
}
