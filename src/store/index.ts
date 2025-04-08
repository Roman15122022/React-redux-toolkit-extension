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

import TimerLogsReducer from './reducers/timeLogsReducer/TimerLogsSlice'
import StateSaverReducer from './reducers/stateSaverReducer/StateSaverSlice'
import SettingReducer from './reducers/settingReducer/SettingSlice'
import SessionDataSlice from './reducers/sessionDataReducer/sessionDataSlice'
import CurrentTimerReducer from './reducers/currentTimerReducer/CurrentTimerSlice'
import ClickerReducer from './reducers/clickerReducer/ClickerSlice'

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['SessionDataSlice'],
}

const rootReducer = combineReducers({
  ClickerReducer,
  SettingReducer,
  CurrentTimerReducer,
  TimerLogsReducer,
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

export type RootState = ReturnType<typeof rootReducer>

export type AppStore = ReturnType<typeof setupStore>

export type AppDispatch = AppStore['dispatch']

/*export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>*/
