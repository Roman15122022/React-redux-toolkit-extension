import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RoutesPath, Sort } from '../../../types'

import { StateHistoryPage, StateSaver } from './types'

const initialState: StateSaver = {
  activeRouteLink: RoutesPath.TRACKER,
  activityNameInput: '',
  historyPage: {
    selectedPage: 1,
    selectedDate: 0,
  },
  sortAchievement: Sort.TIME,
  isHintActive: false,
}

export const stateSaverSlice = createSlice({
  name: 'stateSaver',
  initialState,
  reducers: {
    saveActivityName(state, action: PayloadAction<string>): void {
      state.activityNameInput = action.payload
    },
    saveHistoryState(state, action: PayloadAction<StateHistoryPage>): void {
      state.historyPage = action.payload
    },
    saveSortAchievement(state, action: PayloadAction<Sort>): void {
      state.sortAchievement = action.payload
    },
    saveActiveRoute(state, action: PayloadAction<RoutesPath>) {
      state.activeRouteLink = action.payload
    },
    saveHintState(state, action: PayloadAction<boolean>) {
      state.isHintActive = action.payload
    },
    resetState(state) {
      Object.assign(state, initialState)
    },
  },
})

export default stateSaverSlice.reducer
