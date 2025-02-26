import { TimePeriod } from '../../types'

export type TextStatisticsProps = {
  isHintActive: boolean
  dates: TimePeriod[]
}

export type StatisticsFields = {
  name: string
  value: string
  description: string
}

export type MinMaxSessions = {
  minTimeSession: string

  maxTimeSession: string
}

export type DaysBasedOnProduct = {
  mostProductDay: string

  mostUnProductDay: string
}
