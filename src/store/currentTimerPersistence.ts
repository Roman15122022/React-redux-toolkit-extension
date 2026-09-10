import storage from 'redux-persist/lib/storage'
import { PersistedState } from 'redux-persist'

import { CurrentTimer } from './reducers/currentTimerReducer/types'

const LEGACY_ROOT_STORAGE_KEY = 'persist:root'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isCurrentTimer(value: unknown): value is CurrentTimer {
  if (!isRecord(value)) return false

  const { elapsedTime, startDate, stateTimer } = value
  const isStateTimerValid =
    stateTimer === null ||
    (isRecord(stateTimer) &&
      typeof stateTimer.isActive === 'boolean' &&
      typeof stateTimer.isPause === 'boolean')

  return (
    typeof elapsedTime === 'number' &&
    typeof startDate === 'number' &&
    isStateTimerValid
  )
}

export async function migrateCurrentTimerState(
  persistedState: PersistedState,
): Promise<PersistedState> {
  if (persistedState) return persistedState

  const serializedRootState = await storage.getItem(LEGACY_ROOT_STORAGE_KEY)

  if (!serializedRootState) return undefined

  try {
    const rootState = JSON.parse(serializedRootState) as unknown

    if (!isRecord(rootState)) return undefined

    const serializedCurrentTimer = rootState.CurrentTimerReducer

    if (typeof serializedCurrentTimer !== 'string') return undefined

    const currentTimer = JSON.parse(serializedCurrentTimer) as unknown

    if (!isCurrentTimer(currentTimer)) return undefined

    return {
      ...currentTimer,
      _persist: { version: -1, rehydrated: true },
    }
  } catch {
    return undefined
  }
}
