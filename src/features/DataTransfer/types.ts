import {
  Locale,
  NotificationSettingState,
  SessionsDomainInfo,
} from '../../types'
import { RootState } from '../../store'

export type DataTransferProps = {
  interfaceLang: Locale
}

export type ChromeStorageData = {
  timerState?: RootState['CurrentTimerReducer']['stateTimer']
  notificationState?: NotificationSettingState
  sessionData: SessionsDomainInfo[]
  blackList: string[]
}

export type ExportedAppData = {
  version: 1
  exportedAt: string
  redux: RootState
  chromeStorage: ChromeStorageData
}

export type StatusMessage = {
  type: 'success' | 'error'
  text: string
} | null
