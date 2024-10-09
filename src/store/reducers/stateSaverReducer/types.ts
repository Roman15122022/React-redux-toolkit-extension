import { Sort } from '../../../types'

export interface StateSaver {
  activityNameInput: string
  historyPage: StateHistoryPage
  sortAchievement: Sort
}

export type StateHistoryPage = {
  selectedPage: number
  selectedDate: number
}
