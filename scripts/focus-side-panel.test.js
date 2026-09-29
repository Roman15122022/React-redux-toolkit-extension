const assert = require('node:assert/strict')
const test = require('node:test')
const path = require('node:path')
const typescript = require('typescript')

require.extensions['.ts'] = (module, filename) => {
  const source = require('node:fs').readFileSync(filename, 'utf8')
  const output = typescript.transpileModule(source, {
    compilerOptions: {
      module: typescript.ModuleKind.CommonJS,
      target: typescript.ScriptTarget.ES2021,
    },
    fileName: filename,
  }).outputText

  module._compile(output, filename)
}

const helpers = require(
  path.resolve(__dirname, '../src/NavigationPages/TrackTimePage/timerState.ts'),
)

test('active time derives from the shared start timestamp', () => {
  assert.equal(
    helpers.getElapsedSeconds(
      {
        startDate: 10_000,
        elapsedTime: 0,
        stateTimer: { isActive: true, isPause: false },
      },
      42_900,
    ),
    32,
  )
})

test('paused time stays fixed and resume keeps elapsed time', () => {
  const pausedTimer = {
    startDate: 10_000,
    elapsedTime: 32,
    stateTimer: { isActive: true, isPause: true },
  }

  assert.equal(helpers.getElapsedSeconds(pausedTimer, 99_000), 32)
  assert.equal(helpers.getResumeStartDate(50_000, 32), 18_000)
})

test('daily goal uses completed history without the active timer', () => {
  const {
    getStudyGoalProgress,
  } = require('../src/features/StudyGoals/helpers.ts')
  const {
    normalizeStudyGoalsConfiguration,
  } = require('../src/features/StudyGoals/configuration.ts')
  const day = new Date(2026, 8, 29, 12).getTime()
  const yesterday = new Date(2026, 8, 28, 12).getTime()
  const sessions = [
    { activityName: 'English', endDate: day, totalTimeForSession: 1200 },
    { activityName: 'English', endDate: yesterday, totalTimeForSession: 2000 },
  ]
  const progress = getStudyGoalProgress(
    sessions,
    normalizeStudyGoalsConfiguration(undefined, 60),
    day,
  )[0]
  assert.equal(progress.completedSeconds, 1200)
  assert.equal(progress.percent, 33)
})

const sidePanel = require('../src/utils/sidePanel.ts')

test('detects the panel through window views when runtime contexts have windowId -1', async () => {
  const panelUrl = 'chrome-extension://tracker/sidePanel.html'
  global.chrome = {
    runtime: {
      getURL: resource => `chrome-extension://tracker/${resource}`,
      getContexts: async filter => {
        return filter.windowIds ? [] : [{ windowId: -1, documentUrl: panelUrl }]
      },
    },
    extension: {
      getViews: filter => {
        assert.deepEqual(filter, { windowId: 12 })
        return [{ location: { href: panelUrl } }]
      },
    },
  }
  assert.equal(await sidePanel.isSidePanelOpen(12), true)
  global.chrome.extension.getViews = () => [
    { location: { href: 'chrome-extension://tracker/popup.html' } },
  ]
  assert.equal(await sidePanel.isSidePanelOpen(12), false)
})

test('opens and closes the panel in the requested window', async () => {
  const operations = []
  global.chrome = {
    sidePanel: {
      open: async options => operations.push(['open', options]),
      close: async options => operations.push(['close', options]),
    },
  }
  await sidePanel.openSidePanel(12)
  await sidePanel.closeSidePanel(12)
  assert.deepEqual(operations, [
    ['open', { windowId: 12 }],
    ['close', { windowId: 12 }],
  ])
})

test('unsupported closing rejects without pretending to close the panel', async () => {
  global.chrome = { sidePanel: { open: async () => undefined } }
  await assert.rejects(sidePanel.closeSidePanel(12), /unavailable/)
})
