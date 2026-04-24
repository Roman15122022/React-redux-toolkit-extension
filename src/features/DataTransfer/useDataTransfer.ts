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

import { ChromeStorageData, ExportedAppData, StatusMessage } from './types'
import { isExportedAppData } from './helpers'

const STORAGE_KEYS = [
  ChromeKeys.CHROME_STATE_TIMER,
  ChromeKeys.CHROME_STATE_NOTIFICATION,
  'sessionData',
  'blackList',
]

export const useDataTransfer = () => {
  const state = useAppSelector(store => store)
  const dispatch = useAppDispatch()
  const inputRef = useRef<HTMLInputElement>(null)
  const [statusMessage, setStatusMessage] = useState<StatusMessage>(null)

  function getChromeStorageData(): Promise<ChromeStorageData> {
    return new Promise(resolve => {
      chrome.storage.local.get(STORAGE_KEYS, result => {
        resolve({
          timerState: result[ChromeKeys.CHROME_STATE_TIMER],
          notificationState: result[ChromeKeys.CHROME_STATE_NOTIFICATION],
          sessionData: result.sessionData || [],
          blackList: result.blackList || [],
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

  async function handleExportData(successText: string): Promise<void> {
    const chromeStorage = await getChromeStorageData()

    downloadJson({
      version: 1,
      exportedAt: new Date().toISOString(),
      redux: state,
      chromeStorage,
    })

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

  function handleImportClick(): void {
    inputRef.current?.click()
  }

  function handleImportData(
    event: ChangeEvent<HTMLInputElement>,
    successText: string,
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
          setStatusMessage({ type: 'error', text: errorText })

          return
        }

        await importData(parsedData)
        setStatusMessage({ type: 'success', text: successText })
      } catch {
        setStatusMessage({ type: 'error', text: errorText })
      }
    }

    reader.readAsText(file)
  }

  return {
    handleExportData,
    handleImportClick,
    handleImportData,
    inputRef,
    statusMessage,
  }
}
