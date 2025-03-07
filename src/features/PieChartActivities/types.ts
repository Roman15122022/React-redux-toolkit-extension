import { TimePeriod } from '../../types'

export type DataActivity = {
  id: number
  value: number
  label: string
}

export type PieChartActivitiesProps = {
  dates: TimePeriod[]
  setIsActivityFilterVisible: (isVisible: boolean) => void
}
