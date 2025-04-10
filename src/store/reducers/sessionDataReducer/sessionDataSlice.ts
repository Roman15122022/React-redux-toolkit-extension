import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { SessionsDomainInfo } from '../../../types'

import { SessionData } from './types'

const initialState: SessionData = {
  sessions: [],
  blackList: [],
}

export const sessionDataSlice = createSlice({
  name: 'sessionSlice',
  initialState,
  reducers: {
    setSessionsData: (state, action: PayloadAction<SessionsDomainInfo[]>) => {
      state.sessions = action.payload
    },
    setBlackList: (state, action: PayloadAction<string[]>) => {
      state.blackList = action.payload
    },
  },
})

export default sessionDataSlice.reducer
