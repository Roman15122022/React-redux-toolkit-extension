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
  distractingDomains?: string[]
}

export type ExportedAppData = {
  version: 1
  exportedAt: string
  redux: RootState
  chromeStorage: ChromeStorageData
}

export type DateRange = {
  from: string
  to: string
}

export type ExportMode = 'all' | 'range'

export type DateRangeBounds = {
  startDate: number
  endDate: number
}

export type ImportMode = 'merge' | 'replace'

export type DataTransferSummary = {
  timerSessionsCount: number
  domainSessionsCount: number
  blackListCount: number
  firstSessionDate?: number
  lastSessionDate?: number
}

export type ImportPreview = {
  data: ExportedAppData
  summary: DataTransferSummary
}

export type StatusMessage = {
  type: 'success' | 'error'
  text: string
} | null

export type MergeDataParams = {
  currentState: RootState
  currentChromeStorage: ChromeStorageData
  importedData: ExportedAppData
}

export type ExportDataParams = {
  state: RootState
  chromeStorage: ChromeStorageData
  dateRange: DateRange
}
