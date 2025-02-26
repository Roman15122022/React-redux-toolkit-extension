import { RoutesPath, Sort } from '../../../types'
import { Period } from '../../../NavigationPages/StatisticsPage/types'

export interface StateSaver {
  activityNameInput: string
  historyPage: StateHistoryPage
  sortAchievement: Sort
  activeRouteLink: RoutesPath
  isHintActive: boolean
  periodStat: Period
}

export type StateHistoryPage = {
  selectedPage: number
  selectedDate: number
}
