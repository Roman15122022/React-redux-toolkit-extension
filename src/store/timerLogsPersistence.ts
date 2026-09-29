import storage from 'redux-persist/lib/storage'
import { PersistedState } from 'redux-persist'

const LEGACY_ROOT_STORAGE_KEY = 'persist:root'

export async function migrateTimerLogsState(
  persistedState: PersistedState,
): Promise<PersistedState> {
  if (persistedState) return persistedState

  const serializedRootState = await storage.getItem(LEGACY_ROOT_STORAGE_KEY)

  if (!serializedRootState) return undefined

  try {
    const rootState = JSON.parse(serializedRootState) as Record<string, string>
    const serializedTimerLogs = rootState.TimerLogsReducer

    if (typeof serializedTimerLogs !== 'string') return undefined

    const timerLogs = JSON.parse(serializedTimerLogs) as Record<string, unknown>

    if (!Array.isArray(timerLogs.dates)) return undefined

    return {
      ...timerLogs,
      _persist: { version: -1, rehydrated: true },
    }
  } catch {
    return undefined
  }
}
