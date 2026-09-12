import { ClassValue } from 'clsx'

import { TimePeriod } from '../../types'

export type StudyTimeInfoProps = {
  lastTime?: string
  date: number
  isLastTimeNeeded: boolean
  compactTotal?: boolean
  heading?: string
  classes?: ClassValue
  sxList?: ClassValue
  onSelectPeriod?: (period: TimePeriod) => void
}

export type Periods = {
  period: string
  activityName: string
  source: TimePeriod
}
