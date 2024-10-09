import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Sort } from '../../../types'

import { StateHistoryPage, StateSaver } from './types'

const initialState: StateSaver = {
  activityNameInput: '',
  historyPage: {
    selectedPage: 1,
    selectedDate: 0,
  },
  sortAchievement: Sort.TIME,
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
  },
})

export default stateSaverSlice.reducer
