import { ChangeEvent, useRef, useState } from 'react'

import { ChromeKeys } from '../../types'
import { timerLogsSlice } from '../../store/reducers/timeLogsReducer/TimerLogsSlice'
import { stateSaverSlice } from '../../store/reducers/stateSaverReducer/StateSaverSlice'
import { settingSlice } from '../../store/reducers/settingReducer/SettingSlice'
import { sessionDataSlice } from '../../store/reducers/sessionDataReducer/sessionDataSlice'
import { currentTimerSlice } from '../../store/reducers/currentTimerReducer/CurrentTimerSlice'
import { clickerSlice } from '../../store/reducers/clickerReducer/ClickerSlice'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'

import {
  ChromeStorageData,
  DateRange,
  ExportMode,
  ExportedAppData,
  ImportMode,
  ImportPreview,
  StatusMessage,
} from './types'
import {
  createExportedAppData,
  createMergedAppData,
  getDataTransferSummary,
  isExportedAppData,
} from './helpers'

const STORAGE_KEYS = [
  ChromeKeys.CHROME_STATE_TIMER,
  ChromeKeys.CHROME_STATE_NOTIFICATION,
  'sessionData',
  'blackList',
  'distractingDomains',
]

export const useDataTransfer = () => {
  const state = useAppSelector(store => store)
  const dispatch = useAppDispatch()
  const inputRef = useRef<HTMLInputElement>(null)
  const [statusMessage, setStatusMessage] = useState<StatusMessage>(null)
  const [dateRange, setDateRange] = useState<DateRange>({ from: '', to: '' })
  const [exportMode, setExportMode] = useState<ExportMode>('all')
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [importMode, setImportMode] = useState<ImportMode>('merge')
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null)

  function getChromeStorageData(): Promise<ChromeStorageData> {
    return new Promise(resolve => {
      chrome.storage.local.get(STORAGE_KEYS, result => {
        resolve({
          timerState: result[ChromeKeys.CHROME_STATE_TIMER],
          notificationState: result[ChromeKeys.CHROME_STATE_NOTIFICATION],
          sessionData: result.sessionData || [],
          blackList: result.blackList || [],
          distractingDomains: result.distractingDomains || [],
        })
      })
    })
  }

  function downloadJson(data: ExportedAppData): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `trackerr-data-${new Date().toISOString()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  async function handleExportData(
    successText: string,
    dateRangeErrorText: string,
  ): Promise<void> {
    const chromeStorage = await getChromeStorageData()
    const exportData = createExportedAppData({
      state,
      chromeStorage,
      dateRange: exportMode === 'range' ? dateRange : { from: '', to: '' },
    })

    if (!exportData) {
      setStatusMessage({ type: 'error', text: dateRangeErrorText })

      return
    }

    downloadJson(exportData)

    setIsExportModalOpen(false)
    setStatusMessage({ type: 'success', text: successText })
  }

  function syncChromeStorage(data: ExportedAppData): Promise<void> {
    const timerState =
      data.chromeStorage.timerState || data.redux.CurrentTimerReducer.stateTimer
    const notificationState =
      data.chromeStorage.notificationState ||
      data.redux.SettingReducer.notification
    const sessionData =
      data.chromeStorage.sessionData || data.redux.SessionDataSlice.sessions
    const blackList =
      data.chromeStorage.blackList || data.redux.SessionDataSlice.blackList
    const distractingDomains =
      data.chromeStorage.distractingDomains ||
      data.redux.SessionDataSlice.distractingDomains ||
      []

    return new Promise(resolve => {
      chrome.storage.local.set(
        {
          [ChromeKeys.CHROME_STATE_TIMER]: timerState || {
            isActive: false,
            isPause: false,
          },
          [ChromeKeys.CHROME_STATE_NOTIFICATION]: notificationState,
          sessionData,
          blackList,
          distractingDomains,
        },
        () => resolve(),
      )
    })
  }

  async function importData(data: ExportedAppData): Promise<void> {
    dispatch(clickerSlice.actions.setClickerState(data.redux.ClickerReducer))
    dispatch(
      currentTimerSlice.actions.setCurrentTimerState(
        data.redux.CurrentTimerReducer,
      ),
    )
    dispatch(
      sessionDataSlice.actions.setSessionState({
        ...data.redux.SessionDataSlice,
        sessions:
          data.chromeStorage.sessionData ||
          data.redux.SessionDataSlice.sessions,
        blackList:
          data.chromeStorage.blackList || data.redux.SessionDataSlice.blackList,
        distractingDomains:
          data.chromeStorage.distractingDomains ||
          data.redux.SessionDataSlice.distractingDomains ||
          [],
      }),
    )
    dispatch(settingSlice.actions.setSettingsState(data.redux.SettingReducer))
    dispatch(
      stateSaverSlice.actions.setStateSaverState(data.redux.StateSaverReducer),
    )
    dispatch(
      timerLogsSlice.actions.setTimerLogsState(data.redux.TimerLogsReducer),
    )

    await syncChromeStorage(data)
  }

  function handleDateRangeChange(field: keyof DateRange, value: string): void {
    setDateRange(prevState => ({ ...prevState, [field]: value }))
  }

  function clearDateRange(): void {
    setDateRange({ from: '', to: '' })
  }

  function handleExportModeChange(mode: ExportMode): void {
    setExportMode(mode)
    setStatusMessage(null)

    if (mode === 'all') {
      clearDateRange()
    }
  }

  function openExportModal(): void {
    setImportPreview(null)
    setStatusMessage(null)
    setExportMode('all')
    clearDateRange()
    setIsExportModalOpen(true)
  }

  function closeExportModal(): void {
    setIsExportModalOpen(false)
    setStatusMessage(null)
  }

  function handleImportClick(): void {
    setIsExportModalOpen(false)
    inputRef.current?.click()
  }

  function handleImportData(
    event: ChangeEvent<HTMLInputElement>,
    errorText: string,
  ): void {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    const reader = new FileReader()

    reader.onload = async (): Promise<void> => {
      try {
        const parsedData = JSON.parse(String(reader.result))

        if (!isExportedAppData(parsedData)) {
          setImportPreview(null)
          setStatusMessage({ type: 'error', text: errorText })

          return
        }

        setImportPreview({
          data: parsedData,
          summary: getDataTransferSummary(parsedData),
        })
        setStatusMessage(null)
      } catch {
        setImportPreview(null)
        setStatusMessage({ type: 'error', text: errorText })
      }
    }

    reader.readAsText(file)
  }

  async function handleConfirmImport(successText: string): Promise<void> {
    if (!importPreview) return

    const dataToImport =
      importMode === 'replace'
        ? importPreview.data
        : createMergedAppData({
            currentState: state,
            currentChromeStorage: await getChromeStorageData(),
            importedData: importPreview.data,
          })

    await importData(dataToImport)
    setImportPreview(null)
    setStatusMessage({ type: 'success', text: successText })
  }

  function handleCancelImport(): void {
    setImportPreview(null)
    setStatusMessage(null)
  }

  return {
    clearDateRange,
    closeExportModal,
    dateRange,
    exportMode,
    handleExportData,
    handleCancelImport,
    handleConfirmImport,
    handleDateRangeChange,
    handleExportModeChange,
    handleImportClick,
    handleImportData,
    importMode,
    importPreview,
    inputRef,
    isExportModalOpen,
    openExportModal,
    setImportMode,
    statusMessage,
  }
}
