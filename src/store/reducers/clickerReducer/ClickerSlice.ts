import { createSlice } from '@reduxjs/toolkit'
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
  },
})

export default clickerSlice.reducer
