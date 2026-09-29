import storage from 'redux-persist/lib/storage'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { migrateTimerLogsState } from './timerLogsPersistence'
import { listenForPersistedChanges } from './syncAcrossPages'
import { migrateSettingState } from './settingPersistence'
import TimerLogsReducer from './reducers/timeLogsReducer/TimerLogsSlice'
import StateSaverReducer from './reducers/stateSaverReducer/StateSaverSlice'
import SettingReducer from './reducers/settingReducer/SettingSlice'
import SessionDataSlice from './reducers/sessionDataReducer/sessionDataSlice'
import CurrentTimerReducer from './reducers/currentTimerReducer/CurrentTimerSlice'
import ClickerReducer from './reducers/clickerReducer/ClickerSlice'
import { migrateCurrentTimerState } from './currentTimerPersistence'

const persistConfig = {
  key: 'root',
  storage,
  blacklist: [
    'CurrentTimerReducer',
    'SessionDataSlice',
    'SettingReducer',
    'TimerLogsReducer',
  ],
}

const currentTimerPersistConfig = {
  key: 'currentTimer',
  storage,
  migrate: migrateCurrentTimerState,
}

const settingPersistConfig = {
  key: 'setting',
  storage,
  migrate: migrateSettingState,
}

const timerLogsPersistConfig = {
  key: 'timerLogs',
  storage,
  migrate: migrateTimerLogsState,
}

const rootReducer = combineReducers({
  ClickerReducer,
  SettingReducer: persistReducer(settingPersistConfig, SettingReducer),
  CurrentTimerReducer: persistReducer(
    currentTimerPersistConfig,
    CurrentTimerReducer,
  ),
  TimerLogsReducer: persistReducer(timerLogsPersistConfig, TimerLogsReducer),
  StateSaverReducer,
  SessionDataSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const setupStore = (): any => {
  return configureStore({
    reducer: persistedReducer,
    devTools: true,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  })
}

export const store = setupStore()

export const persistor = persistStore(store)

if (typeof window !== 'undefined') {
  listenForPersistedChanges(store)
}

export type RootState = ReturnType<typeof rootReducer>

export type AppStore = ReturnType<typeof setupStore>

export type AppDispatch = AppStore['dispatch']

/*export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>*/
