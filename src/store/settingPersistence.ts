import storage from 'redux-persist/lib/storage'
import { PersistedState } from 'redux-persist'

import { Language, ThemeVariants } from '../types'

import { Setting } from './reducers/settingReducer/types'

const LEGACY_ROOT_STORAGE_KEY = 'persist:root'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isSetting(value: unknown): value is Setting {
  if (!isRecord(value) || !isRecord(value.notification)) return false

  const { language, notification, saveStateAfterClose, theme } = value

  return (
    (language === Language.EN || language === Language.UA) &&
    (theme === ThemeVariants.DARK || theme === ThemeVariants.LIGHT) &&
    typeof saveStateAfterClose === 'boolean' &&
    typeof notification.isNotificationActive === 'boolean' &&
    typeof notification.periodInMinutes === 'number'
  )
}

export async function migrateSettingState(
  persistedState: PersistedState,
): Promise<PersistedState> {
  if (persistedState) return persistedState

  const serializedRootState = await storage.getItem(LEGACY_ROOT_STORAGE_KEY)

  if (!serializedRootState) return undefined

  try {
    const rootState = JSON.parse(serializedRootState) as unknown

    if (!isRecord(rootState)) return undefined

    const serializedSetting = rootState.SettingReducer

    if (typeof serializedSetting !== 'string') return undefined

    const setting = JSON.parse(serializedSetting) as unknown

    if (!isSetting(setting)) return undefined

    return {
      ...setting,
      _persist: { version: -1, rehydrated: true },
    }
  } catch {
    return undefined
  }
}
