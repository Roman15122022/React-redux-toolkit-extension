import { TimePeriod } from '../../types'

export type CalendarHeatmapProps = {
  dates: TimePeriod[]
  selectedDate?: number
  onSelectDate?: (date: number) => void
  rangeMonths?: number
  showHeader?: boolean
  size?: 'dense' | 'compact' | 'comfortable'
}

export type CalendarHeatmapDay = {
  date: Date
  dateKey: string
  totalTime: number
  sessionsCount: number
  intensity: number
  isFuture: boolean
}

export type CalendarHeatmapWeek = CalendarHeatmapDay[]
