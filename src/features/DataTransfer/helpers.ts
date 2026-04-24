import { ExportedAppData } from './types'

export function isExportedAppData(data: unknown): data is ExportedAppData {
  if (!data || typeof data !== 'object') return false

  const value = data as ExportedAppData

  return Boolean(
    value.version === 1 &&
      value.redux &&
      value.chromeStorage &&
      value.redux.ClickerReducer &&
      value.redux.CurrentTimerReducer &&
      value.redux.SettingReducer &&
      value.redux.StateSaverReducer &&
      value.redux.TimerLogsReducer &&
      value.redux.SessionDataSlice &&
      Array.isArray(value.redux.TimerLogsReducer?.dates) &&
      Array.isArray(value.redux.SessionDataSlice?.sessions) &&
      Array.isArray(value.redux.SessionDataSlice?.blackList) &&
      Array.isArray(value.chromeStorage.sessionData) &&
      Array.isArray(value.chromeStorage.blackList),
  )
}
