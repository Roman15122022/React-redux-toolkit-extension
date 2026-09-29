const assert = require('node:assert/strict')
const test = require('node:test')
const path = require('node:path')
const typescript = require('typescript')

const sourceRoot = `${path.resolve(__dirname, '../src')}${path.sep}`

require.extensions['.ts'] = (module, filename) => {
  const source = require('node:fs').readFileSync(filename, 'utf8')
  const output = typescript.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: typescript.ModuleKind.CommonJS,
      target: typescript.ScriptTarget.ES2021,
    },
    fileName: filename,
  }).outputText

  module._compile(output, filename)
}

function createLocalStorage() {
  const values = new Map()

  return {
    clear() {
      values.clear()
    },
    getItem(key) {
      return values.get(key) ?? null
    },
    removeItem(key) {
      values.delete(key)
    },
    setItem(key, value) {
      values.set(key, value)
    },
  }
}

const localStorage = createLocalStorage()

global.self = { localStorage }
global.chrome = {
  storage: {
    local: {
      set(_data, callback) {
        callback?.()
      },
    },
  },
}

function clearSourceModules() {
  Object.keys(require.cache).forEach(modulePath => {
    if (modulePath.startsWith(sourceRoot)) {
      delete require.cache[modulePath]
    }
  })
}

function loadStoreInstance() {
  clearSourceModules()

  return require('../src/store')
}

function waitForRehydration(persistor) {
  if (persistor.getState().bootstrapped) {
    return Promise.resolve()
  }

  return new Promise(resolve => {
    const unsubscribe = persistor.subscribe(() => {
      if (!persistor.getState().bootstrapped) return

      unsubscribe()
      resolve()
    })
  })
}

test('changing settings does not restore a timer stopped in another extension page', async () => {
  localStorage.clear()

  const popupPage = loadStoreInstance()
  await waitForRehydration(popupPage.persistor)
  popupPage.store.dispatch({
    type: 'currentTimer/setCurrentTimerState',
    payload: {
      startDate: 1_725_897_600_000,
      elapsedTime: 30,
      stateTimer: { isActive: true, isPause: false },
    },
  })
  await popupPage.persistor.flush()

  const settingsPage = loadStoreInstance()
  await waitForRehydration(settingsPage.persistor)
  await settingsPage.persistor.flush()

  popupPage.store.dispatch({
    type: 'currentTimer/setCurrentTimerState',
    payload: {
      startDate: 0,
      elapsedTime: 0,
      stateTimer: null,
    },
  })
  await popupPage.persistor.flush()

  settingsPage.store.dispatch({
    type: 'locale/toggleTheme',
    payload: 'light',
  })
  await settingsPage.persistor.flush()

  const reopenedPopupPage = loadStoreInstance()
  await waitForRehydration(reopenedPopupPage.persistor)

  const { startDate, elapsedTime, stateTimer } =
    reopenedPopupPage.store.getState().CurrentTimerReducer

  assert.deepEqual(
    { startDate, elapsedTime, stateTimer },
    {
      startDate: 0,
      elapsedTime: 0,
      stateTimer: null,
    },
  )
})

test('changing the theme twice does not remove a period completed in another extension page', async () => {
  localStorage.clear()
  const popupPage = loadStoreInstance()
  await waitForRehydration(popupPage.persistor)
  popupPage.store.dispatch({
    type: 'currentTimer/setCurrentTimerState',
    payload: {
      startDate: 1_725_897_600_000,
      elapsedTime: 30,
      stateTimer: { isActive: true, isPause: false },
    },
  })
  await popupPage.persistor.flush()

  const settingsPage = loadStoreInstance()
  await waitForRehydration(settingsPage.persistor)
  await settingsPage.persistor.flush()

  const completedPeriod = {
    activityName: 'Regression check',
    startDate: 1_725_897_600_000,
    endDate: 1_725_897_630_000,
    dayOfWeek: 2,
    totalTimeForSession: 30,
    mood: '3',
  }

  popupPage.store.dispatch({
    type: 'timerLogs/addTimeLogs',
    payload: completedPeriod,
  })
  popupPage.store.dispatch({
    type: 'currentTimer/setCurrentTimerState',
    payload: {
      startDate: 0,
      elapsedTime: 0,
      stateTimer: null,
    },
  })
  await popupPage.persistor.flush()

  settingsPage.store.dispatch({
    type: 'locale/toggleTheme',
    payload: 'light',
  })
  await settingsPage.persistor.flush()
  settingsPage.store.dispatch({
    type: 'locale/toggleTheme',
    payload: 'dark',
  })
  await settingsPage.persistor.flush()

  const reopenedPopupPage = loadStoreInstance()
  await waitForRehydration(reopenedPopupPage.persistor)

  assert.deepEqual(reopenedPopupPage.store.getState().TimerLogsReducer.dates, [
    completedPeriod,
  ])
})

test('timer history has its own persistence key and survives a stale page write', async () => {
  localStorage.clear()
  const popupPage = loadStoreInstance()
  await waitForRehydration(popupPage.persistor)
  const settingsPage = loadStoreInstance()
  await waitForRehydration(settingsPage.persistor)

  const completedPeriod = {
    activityName: 'Panel session',
    startDate: 1_725_897_600_000,
    endDate: 1_725_897_630_000,
    dayOfWeek: 2,
    totalTimeForSession: 30,
    mood: '3',
  }

  popupPage.store.dispatch({
    type: 'timerLogs/addTimeLogs',
    payload: completedPeriod,
  })
  await popupPage.persistor.flush()
  const { synchronizePersistedState } = require('../src/store/syncAcrossPages')
  synchronizePersistedState(
    settingsPage.store,
    'persist:timerLogs',
    localStorage.getItem('persist:timerLogs'),
  )
  settingsPage.store.dispatch({ type: 'locale/toggleTheme', payload: 'light' })
  await settingsPage.persistor.flush()

  assert.ok(localStorage.getItem('persist:timerLogs'))
  const reopenedPage = loadStoreInstance()
  await waitForRehydration(reopenedPage.persistor)
  assert.deepEqual(reopenedPage.store.getState().TimerLogsReducer.dates, [
    completedPeriod,
  ])
})

test('a second page receives timer pause and note changes from persisted state', async () => {
  localStorage.clear()
  const popupPage = loadStoreInstance()
  await waitForRehydration(popupPage.persistor)
  const sidePanelPage = loadStoreInstance()
  await waitForRehydration(sidePanelPage.persistor)
  await sidePanelPage.persistor.flush()

  popupPage.store.dispatch({
    type: 'currentTimer/setCurrentTimerState',
    payload: {
      startDate: 1_725_897_600_000,
      elapsedTime: 32,
      pauseCount: 1,
      note: 'Read chapter two',
      stateTimer: { isActive: true, isPause: true },
    },
  })
  await popupPage.persistor.flush()

  const { synchronizePersistedState } = require('../src/store/syncAcrossPages')
  synchronizePersistedState(
    sidePanelPage.store,
    'persist:currentTimer',
    localStorage.getItem('persist:currentTimer'),
  )

  assert.equal(
    sidePanelPage.store.getState().CurrentTimerReducer.elapsedTime,
    32,
  )
  assert.equal(
    sidePanelPage.store.getState().CurrentTimerReducer.note,
    'Read chapter two',
  )
  assert.equal(
    sidePanelPage.store.getState().CurrentTimerReducer.stateTimer.isPause,
    true,
  )
})

test('migrates timer history from the legacy root persistence key', async () => {
  localStorage.clear()
  const legacyLogs = {
    dates: [
      {
        activityName: 'Legacy session',
        startDate: 1_725_897_600_000,
        endDate: 1_725_897_630_000,
        dayOfWeek: 2,
        totalTimeForSession: 30,
        mood: '3',
      },
    ],
    lastStartDate: 1_725_897_600_000,
    lastNameActivity: 'Legacy session',
    lastMood: '3',
  }
  localStorage.setItem(
    'persist:root',
    JSON.stringify({
      TimerLogsReducer: JSON.stringify(legacyLogs),
      _persist: JSON.stringify({ version: -1, rehydrated: true }),
    }),
  )

  const page = loadStoreInstance()
  await waitForRehydration(page.persistor)

  assert.deepEqual(
    page.store.getState().TimerLogsReducer.dates,
    legacyLogs.dates,
  )
})

test('migrates the timer from the legacy root persistence key', async () => {
  localStorage.clear()

  const legacyTimerState = {
    startDate: 1_725_897_600_000,
    elapsedTime: 30,
    stateTimer: { isActive: true, isPause: false },
  }

  localStorage.setItem(
    'persist:root',
    JSON.stringify({
      CurrentTimerReducer: JSON.stringify(legacyTimerState),
      _persist: JSON.stringify({ version: -1, rehydrated: true }),
    }),
  )

  const popupPage = loadStoreInstance()
  await waitForRehydration(popupPage.persistor)

  const { startDate, elapsedTime, stateTimer } =
    popupPage.store.getState().CurrentTimerReducer

  assert.deepEqual({ startDate, elapsedTime, stateTimer }, legacyTimerState)
})

test('migrates settings from the legacy root persistence key', async () => {
  localStorage.clear()

  const legacySettingsState = {
    language: 'uk',
    theme: 'light',
    saveStateAfterClose: false,
    notification: {
      isNotificationActive: false,
      periodInMinutes: 25,
    },
  }

  localStorage.setItem(
    'persist:root',
    JSON.stringify({
      SettingReducer: JSON.stringify(legacySettingsState),
      _persist: JSON.stringify({ version: -1, rehydrated: true }),
    }),
  )

  const settingsPage = loadStoreInstance()
  await waitForRehydration(settingsPage.persistor)

  const { language, theme, saveStateAfterClose, notification } =
    settingsPage.store.getState().SettingReducer

  assert.deepEqual(
    { language, theme, saveStateAfterClose, notification },
    legacySettingsState,
  )
})

test('tracks pause count for the active timer and resets it with timer data', async () => {
  localStorage.clear()
  const popupPage = loadStoreInstance()
  await waitForRehydration(popupPage.persistor)

  popupPage.store.dispatch({ type: 'currentTimer/incrementPauseCount' })
  popupPage.store.dispatch({ type: 'currentTimer/incrementPauseCount' })

  assert.equal(popupPage.store.getState().CurrentTimerReducer.pauseCount, 2)

  popupPage.store.dispatch({ type: 'currentTimer/resetCurrentTimer' })

  assert.equal(popupPage.store.getState().CurrentTimerReducer.pauseCount, 0)
})

test('updates optional summary details on one completed timer log', async () => {
  localStorage.clear()
  const popupPage = loadStoreInstance()
  await waitForRehydration(popupPage.persistor)
  const completedPeriod = {
    activityName: 'Programming',
    startDate: 1_725_897_600_000,
    endDate: 1_725_897_630_000,
    dayOfWeek: 2,
    totalTimeForSession: 30,
    mood: '4',
  }

  popupPage.store.dispatch({
    type: 'timerLogs/addTimeLogs',
    payload: completedPeriod,
  })
  popupPage.store.dispatch({
    type: 'timerLogs/updateTimeLog',
    payload: {
      startDate: completedPeriod.startDate,
      changes: { note: 'Add tests next', focusScore: 86 },
    },
  })

  assert.deepEqual(popupPage.store.getState().TimerLogsReducer.dates[0], {
    ...completedPeriod,
    note: 'Add tests next',
    focusScore: 86,
  })
})

test('toggles a distracting domain without adding it to the blacklist', async () => {
  localStorage.clear()
  const popupPage = loadStoreInstance()
  await waitForRehydration(popupPage.persistor)

  popupPage.store.dispatch({
    type: 'sessionSlice/toggleDistractingDomain',
    payload: 'youtube.com',
  })

  assert.deepEqual(
    popupPage.store.getState().SessionDataSlice.distractingDomains,
    ['youtube.com'],
  )
  assert.deepEqual(popupPage.store.getState().SessionDataSlice.blackList, [])

  popupPage.store.dispatch({
    type: 'sessionSlice/toggleDistractingDomain',
    payload: 'youtube.com',
  })

  assert.deepEqual(
    popupPage.store.getState().SessionDataSlice.distractingDomains,
    [],
  )
})

test('study goals persist deletion and synchronize across extension pages', async () => {
  localStorage.clear()
  const popupPage = loadStoreInstance()
  await waitForRehydration(popupPage.persistor)
  await popupPage.persistor.flush()
  const settingsPage = loadStoreInstance()
  await waitForRehydration(settingsPage.persistor)
  const { synchronizePersistedState } = require('../src/store/syncAcrossPages')
  settingsPage.store.dispatch({
    type: 'locale/saveStudyGoal',
    payload: {
      id: 'week',
      kind: 'weekly-total',
      targetMinutes: 600,
      enabled: true,
      activityNames: [],
    },
  })
  settingsPage.store.dispatch({
    type: 'locale/deleteStudyGoal',
    payload: 'daily-total',
  })
  await settingsPage.persistor.flush()
  synchronizePersistedState(
    popupPage.store,
    'persist:setting',
    localStorage.getItem('persist:setting'),
  )
  assert.deepEqual(
    popupPage.store.getState().SettingReducer.studyGoals,
    settingsPage.store.getState().SettingReducer.studyGoals,
  )
  popupPage.store.dispatch({ type: 'currentTimer/setElapsedTime', payload: 50 })
  popupPage.store.dispatch({
    type: 'timerLogs/addTimeLogs',
    payload: {
      activityName: 'English',
      startDate: Date.now() - 60000,
      endDate: Date.now(),
      totalTimeForSession: 60,
      dayOfWeek: 2,
      mood: '3',
    },
  })
  await popupPage.persistor.flush()
  synchronizePersistedState(
    settingsPage.store,
    'persist:timerLogs',
    localStorage.getItem('persist:timerLogs'),
  )
  assert.equal(settingsPage.store.getState().TimerLogsReducer.dates.length, 1)
  const reopenedPopup = loadStoreInstance()
  await waitForRehydration(reopenedPopup.persistor)
  assert.deepEqual(
    reopenedPopup.store
      .getState()
      .SettingReducer.studyGoals.goals.map(goal => goal.id),
    ['week'],
  )
})

test('migrates separate setting persistence and validates goal backup fields', async () => {
  localStorage.clear()
  localStorage.setItem(
    'persist:setting',
    JSON.stringify({
      language: JSON.stringify('en'),
      theme: JSON.stringify('dark'),
      saveStateAfterClose: JSON.stringify(true),
      dailyGoalMinutes: JSON.stringify(90),
      notification: JSON.stringify({
        isNotificationActive: true,
        periodInMinutes: 60,
      }),
      _persist: JSON.stringify({ version: -1, rehydrated: true }),
    }),
  )
  const popupPage = loadStoreInstance()
  await waitForRehydration(popupPage.persistor)
  assert.equal(
    popupPage.store.getState().SettingReducer.studyGoals.goals[0].targetMinutes,
    90,
  )
  const {
    createExportedAppData,
    isExportedAppData,
    createMergedAppData,
  } = require('../src/features/DataTransfer/helpers')
  const state = popupPage.store.getState()
  const chromeStorage = { sessionData: [], blackList: [] }
  const backup = createExportedAppData({
    state,
    chromeStorage,
    dateRange: { from: '', to: '' },
  })
  assert.equal(isExportedAppData(backup), true)
  const importedBackup = structuredClone(backup)
  importedBackup.redux.SettingReducer.studyGoals.goals[0].targetMinutes = 120
  const merged = createMergedAppData({
    currentState: state,
    currentChromeStorage: chromeStorage,
    importedData: importedBackup,
  })
  assert.equal(
    merged.redux.SettingReducer.studyGoals.goals[0].targetMinutes,
    90,
  )
  popupPage.store.dispatch({
    type: 'locale/setSettingsState',
    payload: importedBackup.redux.SettingReducer,
  })
  assert.equal(
    popupPage.store.getState().SettingReducer.studyGoals.goals[0].targetMinutes,
    120,
  )
  importedBackup.redux.SettingReducer.studyGoals.maxDailyMinutes = -10
  assert.equal(isExportedAppData(importedBackup), false)
  delete importedBackup.redux.SettingReducer.studyGoals
  assert.equal(isExportedAppData(importedBackup), true)
})
