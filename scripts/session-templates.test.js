const assert = require('node:assert/strict')
const test = require('node:test')
const filesystem = require('node:fs')
const typescript = require('typescript')

require.extensions['.ts'] = (module, filename) => {
  module._compile(
    typescript.transpileModule(filesystem.readFileSync(filename, 'utf8'), {
      compilerOptions: {
        esModuleInterop: true,
        module: typescript.ModuleKind.CommonJS,
        target: typescript.ScriptTarget.ES2021,
      },
      fileName: filename,
    }).outputText,
    filename,
  )
}

const template = {
  id: 'english',
  name: 'English focus',
  activityName: 'English',
  targetMinutes: 25,
  mood: '4',
  focusMode: true,
  blockedDomains: ['youtube.com', 'reddit.com'],
}

const helpers = () => require('../src/features/SessionTemplates/helpers.ts')

test('rejects invalid targets, moods and names; detects normalized duplicates', () => {
  const { getTemplateError } = helpers()
  assert.equal(getTemplateError(template, []), null)
  assert.equal(
    getTemplateError({ ...template, id: 'other', name: ' ENGLISH FOCUS ' }, [
      template,
    ]),
    'duplicate',
  )
  for (const targetMinutes of [0, -1, 1.5, NaN, Infinity, 1441]) {
    assert.equal(
      getTemplateError({ ...template, targetMinutes }, []),
      'invalid',
    )
  }
  for (const changes of [
    { name: ' ' },
    { activityName: '' },
    { mood: '6' },
    { blockedDomains: [null] },
  ]) {
    assert.equal(getTemplateError({ ...template, ...changes }, []), 'invalid')
  }
})

test('settings preserve template order, reject conflicts, edit and delete', () => {
  const {
    default: reducer,
    settingSlice,
  } = require('../src/store/reducers/settingReducer/SettingSlice.ts')
  let settings = reducer(undefined, { type: 'initial' })
  assert.ok(
    settingSlice.actions.saveSessionTemplate,
    'template saving is available',
  )
  settings = reducer(
    settings,
    settingSlice.actions.saveSessionTemplate(template),
  )
  settings = reducer(
    settings,
    settingSlice.actions.saveSessionTemplate({
      ...template,
      id: 'duplicate',
      name: 'english focus',
    }),
  )
  assert.equal(settings.sessionTemplates.length, 1)
  settings = reducer(
    settings,
    settingSlice.actions.saveSessionTemplate({
      ...template,
      id: 'code',
      name: 'Code',
      activityName: 'Programming',
    }),
  )
  settings = reducer(
    settings,
    settingSlice.actions.moveSessionTemplate({ id: 'code', direction: -1 }),
  )
  assert.deepEqual(
    settings.sessionTemplates.map(item => item.id),
    ['code', 'english'],
  )
  settings = reducer(
    settings,
    settingSlice.actions.moveSessionTemplate({ id: 'code', direction: -1 }),
  )
  settings = reducer(
    settings,
    settingSlice.actions.saveSessionTemplate({
      ...template,
      targetMinutes: 40,
    }),
  )
  assert.equal(settings.sessionTemplates[1].targetMinutes, 40)
  settings = reducer(
    settings,
    settingSlice.actions.deleteSessionTemplate('code'),
  )
  assert.deepEqual(
    settings.sessionTemplates.map(item => item.id),
    ['english'],
  )
  settings = reducer(
    settings,
    settingSlice.actions.setSettingsState({
      ...settings,
      sessionTemplates: [null, template, { ...template, id: 'copy' }],
    }),
  )
  assert.deepEqual(settings.sessionTemplates, [template])
})

test('recent sessions restore configuration and safely derive legacy duration', () => {
  const { templateFromSession, getRecentTemplates } = helpers()
  const session = {
    activityName: 'English',
    mood: '4',
    totalTimeForSession: 95,
    startDate: 100,
    endDate: 200,
    dayOfWeek: 1,
  }
  const recent = templateFromSession(session)
  assert.equal(recent.targetMinutes, 2)
  assert.equal(recent.activityName, 'English')
  assert.equal(recent.focusMode, true)
  const configured = {
    ...session,
    sessionConfiguration: {
      targetMinutes: 25,
      focusMode: false,
      blockedDomains: ['reddit.com'],
    },
  }
  assert.equal(templateFromSession(configured).targetMinutes, 25)
  assert.equal(templateFromSession(configured).focusMode, false)
  assert.deepEqual(templateFromSession(configured).blockedDomains, [
    'reddit.com',
  ])
  assert.equal(
    getRecentTemplates([session, configured, { ...configured, startDate: 300 }])
      .length,
    2,
  )
  assert.equal(getRecentTemplates([{ ...session, activityName: '' }]).length, 0)
})

test('session blocking omits deleted entries and respects focus without overwriting global list', () => {
  const { getSessionConfiguration, getSessionBlockedDomains } = helpers()
  const globalDomains = ['youtube.com', 'example.com']
  assert.deepEqual(getSessionConfiguration(template, globalDomains), {
    targetMinutes: 25,
    focusMode: true,
    blockedDomains: ['youtube.com'],
  })
  assert.deepEqual(
    getSessionBlockedDomains({ isActive: true }, globalDomains),
    globalDomains,
  )
  assert.deepEqual(
    getSessionBlockedDomains(
      { isActive: true, blockedDomains: [] },
      globalDomains,
    ),
    [],
  )
  assert.deepEqual(
    getSessionBlockedDomains(
      { isActive: true, blockedDomains: ['youtube.com'] },
      ['example.com'],
    ),
    [],
  )
  assert.deepEqual(
    getSessionConfiguration({ ...template, focusMode: false }, globalDomains)
      .blockedDomains,
    ['youtube.com'],
  )
  assert.deepEqual(globalDomains, ['youtube.com', 'example.com'])
})

test('template configuration survives pause/resume and resets before a manual session', () => {
  const writes = []
  global.chrome = {
    storage: {
      local: {
        set: (data, callback) => {
          writes.push(data)
          callback?.()
        },
      },
    },
  }
  const {
    default: reducer,
    currentTimerSlice,
  } = require('../src/store/reducers/currentTimerReducer/CurrentTimerSlice.ts')
  let timer = reducer(undefined, { type: 'initial' })
  assert.ok(
    currentTimerSlice.actions.setSessionConfiguration,
    'session configuration is available',
  )
  timer = reducer(
    timer,
    currentTimerSlice.actions.setSessionConfiguration({
      targetMinutes: 25,
      focusMode: true,
      blockedDomains: ['youtube.com'],
    }),
  )
  timer = reducer(
    timer,
    currentTimerSlice.actions.setStateTimer({ isActive: true, isPause: false }),
  )
  timer = reducer(
    timer,
    currentTimerSlice.actions.setStateTimer({ isActive: true, isPause: true }),
  )
  assert.deepEqual(writes.at(-1).timerState.blockedDomains, ['youtube.com'])
  timer = reducer(
    timer,
    currentTimerSlice.actions.setStateTimer({ isActive: true, isPause: false }),
  )
  assert.equal(timer.sessionConfiguration.targetMinutes, 25)
  timer = reducer(timer, currentTimerSlice.actions.resetCurrentTimer())
  timer = reducer(
    timer,
    currentTimerSlice.actions.setStateTimer({ isActive: true, isPause: false }),
  )
  assert.equal(writes.at(-1).timerState.blockedDomains, undefined)
  delete global.chrome
})

test('long activity names remain available in recent sessions and keep the full activity', () => {
  const { getRecentTemplates } = helpers()
  const activityName = 'English practice '.repeat(10).trim()
  const recent = getRecentTemplates([
    {
      activityName,
      mood: '4',
      totalTimeForSession: 60,
      startDate: 500,
      endDate: 600,
      dayOfWeek: 1,
    },
  ])
  assert.equal(recent.length, 1)
  assert.equal(recent[0].activityName, activityName)
  assert.equal(recent[0].name.length, 80)
})

test('background navigation blocks only the active session preset and retains manual blocking', async () => {
  let navigationListener
  const redirects = []
  const stored = {
    timerState: { isActive: false, isPause: false },
    blackList: ['example.com', 'example.org'],
  }
  const event = { addListener() {} }
  const storage = {
    async get(keys) {
      const names = typeof keys === 'string' ? [keys] : keys
      return Object.fromEntries(names.map(key => [key, stored[key]]))
    },
    async set(values) {
      Object.assign(stored, values)
    },
    async remove() {},
  }
  global.chrome = {
    storage: { local: storage, session: storage, onChanged: event },
    runtime: {
      onMessage: event,
      getURL: resource => `chrome-extension://tracker/${resource}`,
    },
    tabs: {
      onUpdated: event,
      onActivated: event,
      update: (tabId, changes) => redirects.push({ tabId, ...changes }),
    },
    windows: {
      onFocusChanged: event,
      getLastFocused: (options, callback) => callback({ focused: false }),
    },
    webNavigation: {
      onBeforeNavigate: {
        addListener(listener) {
          navigationListener = listener
        },
      },
    },
    alarms: { onAlarm: event },
  }
  require('../src/background/background.ts')
  await new Promise(resolve => setImmediate(resolve))
  const navigate = hostname =>
    navigationListener({
      frameId: 0,
      parentFrameId: -1,
      tabId: 7,
      url: `https://${hostname}/`,
    })
  stored.timerState = {
    isActive: true,
    isPause: false,
    blockedDomains: ['example.com'],
  }
  await navigate('example.org')
  assert.equal(redirects.length, 0)
  await navigate('sub.example.com')
  assert.deepEqual(redirects, [
    {
      tabId: 7,
      url: 'chrome-extension://tracker/blocked.html?from=https%3A%2F%2Fsub.example.com%2F',
    },
  ])
  stored.timerState = { isActive: true, isPause: false, blockedDomains: [] }
  await navigate('example.com')
  assert.equal(redirects.length, 1)
  stored.timerState = { isActive: true, isPause: false }
  await navigate('example.org')
  assert.equal(redirects.length, 2)
  stored.timerState = { isActive: false, isPause: false }
  await navigate('example.org')
  assert.equal(redirects.length, 2)
  delete global.chrome
})
