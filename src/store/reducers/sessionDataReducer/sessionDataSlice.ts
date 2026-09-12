import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { SessionsDomainInfo } from '../../../types'

import { SessionData } from './types'

const initialState: SessionData = {
  sessions: [],
  blackList: [],
  distractingDomains: [],
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
    setDistractingDomains: (state, action: PayloadAction<string[]>) => {
      state.distractingDomains = action.payload
    },
    toggleDistractingDomain: (state, action: PayloadAction<string>) => {
      const normalizedDomain = action.payload
        .replace(/^www\./, '')
        .toLowerCase()

      if (state.distractingDomains.includes(normalizedDomain)) {
        state.distractingDomains = state.distractingDomains.filter(
          domain => domain !== normalizedDomain,
        )

        return
      }

      state.distractingDomains.push(normalizedDomain)
    },
    setSessionState: (state, action: PayloadAction<SessionData>) => {
      Object.assign(state, action.payload)
    },
  },
})

export default sessionDataSlice.reducer
