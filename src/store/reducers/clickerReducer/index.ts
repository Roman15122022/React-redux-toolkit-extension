import { createAction, createReducer, createSlice } from '@reduxjs/toolkit'
import { Count } from './enums'
import { UserClicker } from './types'

const initialState: UserClicker = {
  count: 0,
}

export const increment = createAction(Count.INCREMENT)
export const decrement = createAction(Count.DECREMENT)

export const clickerSlice = createSlice({
  name: 'clicker',
  initialState,
  reducers: {},
})

export default clickerSlice.reducer
