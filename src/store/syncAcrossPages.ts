import { Store } from '@reduxjs/toolkit'

import { timerLogsSlice } from './reducers/timeLogsReducer/TimerLogsSlice'
import { settingSlice } from './reducers/settingReducer/SettingSlice'
import { currentTimerSlice } from './reducers/currentTimerReducer/CurrentTimerSlice'

import { RootState } from './index'

type SyncedSlice = 'CurrentTimerReducer' | 'TimerLogsReducer' | 'SettingReducer'

const persistenceKeys: Record<string, SyncedSlice> = {
  'persist:currentTimer': 'CurrentTimerReducer',
  'persist:timerLogs': 'TimerLogsReducer',
  'persist:setting': 'SettingReducer',
}

function readPersistedSlice(serializedState: string): Record<string, unknown> {
  const persistedState = JSON.parse(serializedState) as Record<string, string>

  return Object.fromEntries(
    Object.entries(persistedState)
      .filter(([key]) => key !== '_persist')
      .map(([key, value]) => [key, JSON.parse(value) as unknown]),
  )
}

export function synchronizePersistedState(
  store: Store<RootState>,
  key: string,
  serializedState: string | null,
): void {
  const slice = persistenceKeys[key]

  if (!slice || !serializedState) return

  try {
    const incomingState = readPersistedSlice(serializedState)
    const currentState = store.getState()[slice]
    const currentValues = Object.fromEntries(
      Object.entries(currentState).filter(([field]) => field !== '_persist'),
    )

    if (JSON.stringify(currentValues) === JSON.stringify(incomingState)) return

    if (slice === 'CurrentTimerReducer') {
      store.dispatch(
        currentTimerSlice.actions.setCurrentTimerState(
          incomingState as unknown as RootState['CurrentTimerReducer'],
        ),
      )
    } else if (slice === 'TimerLogsReducer') {
      store.dispatch(
        timerLogsSlice.actions.setTimerLogsState(
          incomingState as unknown as RootState['TimerLogsReducer'],
        ),
      )
    } else {
      store.dispatch(
        settingSlice.actions.setSettingsState(
          incomingState as unknown as RootState['SettingReducer'],
        ),
      )
    }
  } catch {
    return
  }
}

export function listenForPersistedChanges(store: Store<RootState>): void {
  window.addEventListener('storage', event => {
    if (!event.key) return

    synchronizePersistedState(store, event.key, event.newValue)
  })
}
