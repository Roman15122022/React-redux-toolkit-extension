import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { TimePeriod } from '../../../types'
import { MAX_SIZE_DATES } from '../../../constants'

import { TimerLogs } from './types'

const initialState: TimerLogs = {
  dates: [],
  lastStartDate: 0,
  lastNameActivity: '',
  lastMood: '3',
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
    updateTimeLog(
      state,
      action: PayloadAction<{
        startDate: number
        changes: Partial<TimePeriod>
      }>,
    ) {
      const timeLog = state.dates.find(
        date => date.startDate === action.payload.startDate,
      )

      if (!timeLog) return

      Object.assign(timeLog, action.payload.changes)
    },
    setLastStartDate(state, action: PayloadAction<number>) {
      state.lastStartDate = action.payload
    },
    setLastNameActivity(state, action: PayloadAction<string>) {
      state.lastNameActivity = action.payload
    },
    setLastMood(state, action: PayloadAction<string>) {
      state.lastMood = action.payload
    },
    setTimerLogsState(state, action: PayloadAction<TimerLogs>) {
      Object.assign(state, action.payload)
    },
    resetData(state) {
      state.dates = []
      state.lastStartDate = 0
    },
  },
})

export default timerLogsSlice.reducer
