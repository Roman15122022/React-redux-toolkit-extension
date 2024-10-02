import { ClassValue } from 'clsx'

export type StudyTimeInfoProps = {
  lastTime?: string
  date: number
  isLastTimeNeeded: boolean
  classes?: ClassValue
}

export type Periods = {
  period: string
  activityName: string
}
