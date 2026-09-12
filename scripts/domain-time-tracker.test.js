const assert = require('node:assert/strict')
const test = require('node:test')
const typescript = require('typescript')

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

const {
  ACTIVE_DOMAIN_SESSION_KEY,
  createDomainTimeTracker,
} = require('../src/background/domainTimeTracker')
const { FINISH_TIMER_SESSION_MESSAGE } = require('../src/constants')

function createStorageArea(initialData = {}) {
  const data = structuredClone(initialData)

  return {
    data,
    async get(keys) {
      const requestedKeys = Array.isArray(keys) ? keys : [keys]

      return requestedKeys.reduce((result, key) => {
        if (key in data) result[key] = structuredClone(data[key])

        return result
      }, {})
    },
    async remove(keys) {
      const requestedKeys = Array.isArray(keys) ? keys : [keys]

      requestedKeys.forEach(key => delete data[key])
    },
    async set(items) {
      Object.assign(data, structuredClone(items))
    },
  }
}

function createHarness(options = {}) {
  const localStorageArea = createStorageArea(options.localData)
  const sessionStorageArea = createStorageArea(options.sessionData)
  let activeTab = options.activeTab ?? {
    active: true,
    url: 'https://github.com/issues',
  }
  let currentTime = options.currentTime ?? 1_000
  let timerState = options.timerState ?? { isActive: false, isPause: false }

  const tracker = createDomainTimeTracker({
    getActiveTab: async () => activeTab,
    getTimerState: async () => timerState,
    localStorageArea,
    now: () => currentTime,
    sessionStorageArea,
  })

  return {
    localStorageArea,
    sessionStorageArea,
    setActiveTab(nextActiveTab) {
      activeTab = nextActiveTab
    },
    setCurrentTime(nextCurrentTime) {
      currentTime = nextCurrentTime
    },
    setTimerState(nextTimerState) {
      timerState = nextTimerState
    },
    tracker,
  }
}

test('starts the current website immediately when the timer starts', async () => {
  const harness = createHarness()

  await harness.tracker.restore()
  await harness.tracker.reconcileTimerState({
    isActive: true,
    isPause: false,
  })

  assert.deepEqual(harness.sessionStorageArea.data[ACTIVE_DOMAIN_SESSION_KEY], {
    domain: 'github.com',
    fullDomain: 'github.com',
    startTime: new Date(1_000).toISOString(),
  })
})

test('does not include paused time after pause and resume', async () => {
  const harness = createHarness({
    timerState: { isActive: true, isPause: false },
  })

  await harness.tracker.reconcile()
  harness.setCurrentTime(4_000)
  await harness.tracker.reconcileTimerState({
    isActive: true,
    isPause: true,
  })
  harness.setCurrentTime(10_000)
  await harness.tracker.reconcileTimerState({
    isActive: true,
    isPause: false,
  })
  harness.setCurrentTime(12_000)
  await harness.tracker.flush()

  assert.deepEqual(
    harness.localStorageArea.data.sessionData.map(session => session.duration),
    [3_000, 2_000],
  )
})

test('closes and starts exact intervals when the active domain changes', async () => {
  const harness = createHarness({
    timerState: { isActive: true, isPause: false },
  })

  await harness.tracker.reconcile()
  harness.setCurrentTime(3_500)
  await harness.tracker.reconcileTab({
    active: true,
    url: 'https://youtube.com/watch?v=1',
  })
  harness.setCurrentTime(8_000)
  await harness.tracker.flush()

  assert.deepEqual(
    harness.localStorageArea.data.sessionData.map(session => ({
      domain: session.domain,
      duration: session.duration,
    })),
    [
      { domain: 'github.com', duration: 2_500 },
      { domain: 'youtube.com', duration: 4_500 },
    ],
  )
})

test('stops on focus loss and starts a fresh interval on focus return', async () => {
  const harness = createHarness({
    timerState: { isActive: true, isPause: false },
  })

  await harness.tracker.reconcile()
  harness.setCurrentTime(2_000)
  await harness.tracker.reconcileTab(null)
  harness.setCurrentTime(7_000)
  await harness.tracker.reconcile()
  harness.setCurrentTime(9_000)
  await harness.tracker.flush()

  assert.deepEqual(
    harness.localStorageArea.data.sessionData.map(session => session.duration),
    [1_000, 2_000],
  )
})

test('restores an open interval after a service worker restart', async () => {
  const firstWorker = createHarness({
    timerState: { isActive: true, isPause: false },
  })

  await firstWorker.tracker.reconcile()

  const secondWorker = createDomainTimeTracker({
    getActiveTab: async () => ({
      active: true,
      url: 'https://github.com/issues',
    }),
    getTimerState: async () => ({ isActive: true, isPause: false }),
    localStorageArea: firstWorker.localStorageArea,
    now: () => 6_000,
    sessionStorageArea: firstWorker.sessionStorageArea,
  })

  await secondWorker.restore()
  await secondWorker.flush()

  assert.equal(firstWorker.localStorageArea.data.sessionData[0].duration, 5_000)
})

test('serializes rapid domain transitions without losing records', async () => {
  const harness = createHarness({
    timerState: { isActive: true, isPause: false },
  })

  await harness.tracker.reconcile()
  harness.setCurrentTime(2_000)
  const youtubeTransition = harness.tracker.reconcileTab({
    active: true,
    url: 'https://youtube.com/watch?v=1',
  })
  harness.setCurrentTime(3_000)
  const docsTransition = harness.tracker.reconcileTab({
    active: true,
    url: 'https://developer.mozilla.org/docs',
  })
  harness.setCurrentTime(4_000)
  const flush = harness.tracker.flush()

  await Promise.all([youtubeTransition, docsTransition, flush])

  assert.deepEqual(
    harness.localStorageArea.data.sessionData.map(session => session.domain),
    ['github.com', 'youtube.com', 'mozilla.org'],
  )
})

test('ignores browser and extension URLs', async () => {
  const harness = createHarness({
    activeTab: { active: true, url: 'chrome://extensions' },
    timerState: { isActive: true, isPause: false },
  })

  await harness.tracker.reconcile()
  harness.setActiveTab({
    active: true,
    url: 'chrome-extension://tracker/popup',
  })
  await harness.tracker.reconcile()
  await harness.tracker.flush()

  assert.equal(harness.localStorageArea.data.sessionData, undefined)
  assert.equal(
    harness.sessionStorageArea.data[ACTIVE_DOMAIN_SESSION_KEY],
    undefined,
  )
})

test('cancel discards the open interval without adding history', async () => {
  const harness = createHarness({
    timerState: { isActive: true, isPause: false },
  })

  await harness.tracker.reconcile()
  harness.setCurrentTime(5_000)
  await harness.tracker.cancel()

  assert.equal(harness.localStorageArea.data.sessionData, undefined)
  assert.equal(
    harness.sessionStorageArea.data[ACTIVE_DOMAIN_SESSION_KEY],
    undefined,
  )
})

function createChromeEvent() {
  const listeners = []

  return {
    addListener(listener) {
      listeners.push(listener)
    },
    async emit(...parameters) {
      await Promise.all(
        listeners.map(listener => listener(...parameters)).filter(Boolean),
      )
      await new Promise(resolve => setImmediate(resolve))
    },
  }
}

function createChromeStorageArea(initialData = {}) {
  const storageArea = createStorageArea(initialData)

  return {
    data: storageArea.data,
    get(keys, callback) {
      const result = storageArea.get(keys)

      if (callback) {
        result.then(callback)

        return undefined
      }

      return result
    },
    remove(keys, callback) {
      const result = storageArea.remove(keys)

      if (callback) {
        result.then(callback)

        return undefined
      }

      return result
    },
    set(items, callback) {
      const result = storageArea.set(items)

      if (callback) {
        result.then(callback)

        return undefined
      }

      return result
    },
  }
}

test('background starts, pauses, resumes, and flushes before finish response', async () => {
  const originalChrome = global.chrome
  const originalDateNow = Date.now
  const localStorageArea = createChromeStorageArea({
    notificationState: { isNotificationActive: false, periodInMinutes: 25 },
    timerState: { isActive: false, isPause: false },
  })
  const sessionStorageArea = createChromeStorageArea()
  const activeTab = {
    active: true,
    id: 1,
    url: 'https://github.com/issues',
    windowId: 1,
  }
  let currentTime = 1_000

  Date.now = () => currentTime
  global.chrome = {
    alarms: {
      clear: async () => true,
      create() {},
      onAlarm: createChromeEvent(),
    },
    notifications: { create() {} },
    runtime: {
      getURL: path => `chrome-extension://tracker/${path}`,
      onMessage: createChromeEvent(),
      onSuspend: createChromeEvent(),
    },
    storage: {
      local: localStorageArea,
      onChanged: createChromeEvent(),
      session: sessionStorageArea,
    },
    tabs: {
      get(_tabId, callback) {
        callback(activeTab)
      },
      onActivated: createChromeEvent(),
      onUpdated: createChromeEvent(),
      query(_query, callback) {
        callback([activeTab])
      },
      update() {},
    },
    webNavigation: { onBeforeNavigate: createChromeEvent() },
    windows: {
      getLastFocused(_options, callback) {
        callback({ focused: true, id: 1, tabs: [activeTab] })
      },
      onFocusChanged: createChromeEvent(),
      WINDOW_ID_NONE: -1,
    },
  }

  try {
    delete require.cache[require.resolve('../src/background/background')]
    require('../src/background/background')
    await new Promise(resolve => setImmediate(resolve))

    const activeTimerState = { isActive: true, isPause: false }

    localStorageArea.data.timerState = activeTimerState
    await global.chrome.storage.onChanged.emit(
      {
        timerState: {
          newValue: activeTimerState,
          oldValue: { isActive: false, isPause: false },
        },
      },
      'local',
    )

    assert.equal(
      sessionStorageArea.data[ACTIVE_DOMAIN_SESSION_KEY].domain,
      'github.com',
    )

    currentTime = 4_000
    const pausedTimerState = { isActive: true, isPause: true }

    localStorageArea.data.timerState = pausedTimerState
    await global.chrome.storage.onChanged.emit(
      {
        timerState: {
          newValue: pausedTimerState,
          oldValue: activeTimerState,
        },
      },
      'local',
    )

    assert.equal(localStorageArea.data.sessionData[0].duration, 3_000)
    assert.equal(sessionStorageArea.data[ACTIVE_DOMAIN_SESSION_KEY], undefined)

    currentTime = 6_000
    localStorageArea.data.timerState = activeTimerState
    await global.chrome.storage.onChanged.emit(
      {
        timerState: {
          newValue: activeTimerState,
          oldValue: pausedTimerState,
        },
      },
      'local',
    )

    currentTime = 8_500
    let finishResponse

    await global.chrome.runtime.onMessage.emit(
      { type: FINISH_TIMER_SESSION_MESSAGE },
      {},
      response => {
        finishResponse = response
      },
    )

    assert.equal(finishResponse.success, true)
    assert.deepEqual(
      finishResponse.sessions.map(session => session.duration),
      [3_000, 2_500],
    )
  } finally {
    Date.now = originalDateNow
    global.chrome = originalChrome
  }
})
