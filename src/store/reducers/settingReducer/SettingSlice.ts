import { Setting } from './types'
import { Language } from '../../../types/enums'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: Setting = {
  language: Language.EN,
  isDark: false,
}

export const settingSlice = createSlice({
  name: 'locale',
  initialState,
  reducers: {
    setLocale(state, action: PayloadAction<Language>): void {
      state.language = action.payload
    },
    toggleTheme(state) {
      state.isDark = !state.isDark
    },
  },
})

export default settingSlice.reducer
