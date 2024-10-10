import { ClassValue } from 'clsx'

export type StudyTimeInfoProps = {
  lastTime?: string
  date: number
  isLastTimeNeeded: boolean
  classes?: ClassValue
  sxList?: ClassValue
}

export type Periods = {
  period: string
  activityName: string
}
