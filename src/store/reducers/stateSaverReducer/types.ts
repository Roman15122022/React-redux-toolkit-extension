import { RoutesPath, Sort } from '../../../types'

export interface StateSaver {
  activityNameInput: string
  historyPage: StateHistoryPage
  sortAchievement: Sort
  activeRouteLink: RoutesPath
}

export type StateHistoryPage = {
  selectedPage: number
  selectedDate: number
}
