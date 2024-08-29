import { Setting } from './types'
import { Language, ThemeVariants } from '../../../types/enums'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: Setting = {
  language: Language.EN,
  theme: ThemeVariants.LIGHT,
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
  },
})

export default settingSlice.reducer
