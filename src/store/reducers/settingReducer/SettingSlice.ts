import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Language, ThemeVariants } from '../../../types'

import { Setting } from './types'

const initialState: Setting = {
  language: Language.EN,
  theme: ThemeVariants.DARK,
  saveStateAfterClose: true,
}

export const settingSlice = createSlice({
  name: 'locale',
  initialState,
  reducers: {
    setLocale(state, action: PayloadAction<Language>): void {
      state.language = action.payload
    },
    toggleTheme(state, action: PayloadAction<ThemeVariants>) {
      state.theme = action.payload
    },
    toggleSaveState(state, action: PayloadAction<boolean>) {
      state.saveStateAfterClose = action.payload
    },
  },
})

export default settingSlice.reducer
