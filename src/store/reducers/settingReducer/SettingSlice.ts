import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
  ChromeKeys,
  Language,
  NotificationSettingState,
  ThemeVariants,
} from '../../../types'

import { Setting } from './types'

const initialState: Setting = {
  language: Language.EN,
  theme: ThemeVariants.DARK,
  saveStateAfterClose: true,
  notification: {
    isNotificationActive: true,
    periodInMinutes: 60,
  },
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
    setNotification(state, action: PayloadAction<NotificationSettingState>) {
      state.notification = action.payload

      const notificationStorage = {
        [ChromeKeys.CHROME_STATE_NOTIFICATION]: action.payload || {
          isNotificationActive: true,
          periodInMinutes: 60,
        },
      }

      chrome.storage.local.set(notificationStorage, () => {
        console.log(action.payload.isNotificationActive)
      })
    },
  },
})

export default settingSlice.reducer
