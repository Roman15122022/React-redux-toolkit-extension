import { TimePeriod } from '../../types'

export type DataActivity = {
  id: string
  value: number
  name: string
}

export type PieChartActivitiesProps = {
  dates: TimePeriod[]
  setIsActivityFilterVisible: (isVisible: boolean) => void
}
