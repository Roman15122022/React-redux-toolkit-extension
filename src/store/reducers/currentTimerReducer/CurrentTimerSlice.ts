import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ChromeKeys, ChromeStorageProps, StateTimer } from '../../../types'

import { CurrentTimer } from './types'

const initialState: CurrentTimer = {
  startDate: 0,
  elapsedTime: 0,
  stateTimer: null,
}

export const currentTimerSlice = createSlice({
  name: 'currentTimer',
  initialState,
  reducers: {
    setStartDate(state, action: PayloadAction<number>) {
      state.startDate = action.payload
    },
    setElapsedTime(state, action: PayloadAction<number>) {
      state.elapsedTime = action.payload
    },
    setStateTimer(state, action: PayloadAction<StateTimer>) {
      state.stateTimer = action.payload

      const isActive = action.payload?.isActive ?? false
      const storageData: ChromeStorageProps = {
        [ChromeKeys.CHROME_STATE_TIMER]: action.payload || {
          isActive: false,
          isPause: false,
        },
      }

      chrome.storage.local.set(storageData, () => {
        console.log(isActive ? 'Timer on' : 'Timer off')
      })
    },
  },
})

export default currentTimerSlice.reducer
