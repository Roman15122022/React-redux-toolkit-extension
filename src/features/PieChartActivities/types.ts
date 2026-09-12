import { TimePeriod } from '../../types'

export type DataActivity = {
  color: string
  id: number
  value: number
  label: string
}

export type PieChartActivitiesProps = {
  dates: TimePeriod[]
  setIsActivityFilterVisible: (isVisible: boolean) => void
}
