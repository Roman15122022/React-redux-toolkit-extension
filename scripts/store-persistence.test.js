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
