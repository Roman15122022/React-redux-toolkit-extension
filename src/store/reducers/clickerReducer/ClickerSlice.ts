import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { UserClicker } from './types'

const initialState: UserClicker = {
  count: 0,
}

export const clickerSlice = createSlice({
  name: 'clicker',
  initialState,
  reducers: {
    increment(state) {
      state.count += 1
    },
    setClickerState(state, action: PayloadAction<UserClicker>) {
      state.count = action.payload.count
    },
  },
})

export default clickerSlice.reducer
