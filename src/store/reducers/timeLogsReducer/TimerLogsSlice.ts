import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { TimePeriod } from '../../../types'
import { MAX_SIZE_DATES } from '../../../constants'

import { TimerLogs } from './types'

const initialState: TimerLogs = {
  dates: [],
  lastStartDate: 0,
}

export const timerLogsSlice = createSlice({
  name: 'timerLogs',
  initialState,
  reducers: {
    addTimeLogs(state, action: PayloadAction<TimePeriod>) {
      if (state.dates.length > MAX_SIZE_DATES) {
        state.dates.shift()
      }

      state.dates.push(action.payload)
    },
    setLastStartDate(state, action: PayloadAction<number>) {
      state.lastStartDate = action.payload
    },
    resetData(state) {
      state.dates = []
    },
  },
})

export default timerLogsSlice.reducer
