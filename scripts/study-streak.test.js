const assert = require('node:assert/strict')
const test = require('node:test')
const typescript = require('typescript')

function transpileTypeScript(module, filename) {
  const source = require('node:fs').readFileSync(filename, 'utf8')
  const output = typescript.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: typescript.JsxEmit.React,
      module: typescript.ModuleKind.CommonJS,
      target: typescript.ScriptTarget.ES2021,
    },
    fileName: filename,
  }).outputText

  module._compile(output, filename)
}

require.extensions['.ts'] = transpileTypeScript
require.extensions['.tsx'] = transpileTypeScript

const statisticsHelpers = require('../src/NavigationPages/StatisticsPage/helpers')

function createCompletedSession(year, month, day, hour = 12) {
  const endDate = new Date(year, month, day, hour).getTime()

  return {
    activityName: 'Study',
    startDate: endDate - 1_800_000,
    endDate,
    dayOfWeek: new Date(endDate).getDay() + 1,
    totalTimeForSession: 1800,
    mood: '4',
  }
}

test('returns a friendly zero streak when history is empty', () => {
  const streak = statisticsHelpers.getStudyStreak?.(
    [],
    new Date(2026, 8, 12).getTime(),
  )

  assert.deepEqual(streak, {
    currentStreak: 0,
    bestStreak: 0,
    isRecoveryDayUsed: false,
  })
})

test('counts unique consecutive study days from unsorted history', () => {
  const streak = statisticsHelpers.getStudyStreak(
    [
      createCompletedSession(2026, 8, 12),
      createCompletedSession(2026, 8, 10),
      createCompletedSession(2026, 8, 11),
      createCompletedSession(2026, 8, 11, 18),
    ],
    new Date(2026, 8, 12).getTime(),
  )

  assert.deepEqual(streak, {
    currentStreak: 3,
    bestStreak: 3,
    isRecoveryDayUsed: false,
  })
})

test('keeps the streak after one missed study day', () => {
  const streak = statisticsHelpers.getStudyStreak(
    [
      createCompletedSession(2026, 8, 8),
      createCompletedSession(2026, 8, 10),
      createCompletedSession(2026, 8, 11),
    ],
    new Date(2026, 8, 12).getTime(),
  )

  assert.deepEqual(streak, {
    currentStreak: 3,
    bestStreak: 3,
    isRecoveryDayUsed: true,
  })
})

test('uses recovery when yesterday was the first missed day', () => {
  const streak = statisticsHelpers.getStudyStreak(
    [createCompletedSession(2026, 8, 8), createCompletedSession(2026, 8, 9)],
    new Date(2026, 8, 11).getTime(),
  )

  assert.deepEqual(streak, {
    currentStreak: 2,
    bestStreak: 2,
    isRecoveryDayUsed: true,
  })
})

test('starts a new streak after a second missed day', () => {
  const streak = statisticsHelpers.getStudyStreak(
    [
      createCompletedSession(2026, 8, 7),
      createCompletedSession(2026, 8, 8),
      createCompletedSession(2026, 8, 10),
      createCompletedSession(2026, 8, 12),
    ],
    new Date(2026, 8, 12).getTime(),
  )

  assert.deepEqual(streak, {
    currentStreak: 1,
    bestStreak: 3,
    isRecoveryDayUsed: false,
  })
})

test('ends the current streak when recovery was used before yesterday', () => {
  const streak = statisticsHelpers.getStudyStreak(
    [createCompletedSession(2026, 8, 8), createCompletedSession(2026, 8, 10)],
    new Date(2026, 8, 12).getTime(),
  )

  assert.deepEqual(streak, {
    currentStreak: 0,
    bestStreak: 2,
    isRecoveryDayUsed: false,
  })
})

test('renders streak progress alongside the empty statistics state', () => {
  const React = require('react')
  const ReactDOMServer = require('react-dom/server')
  const hookModulePath = require.resolve(
    '../src/NavigationPages/StatisticsPage/useStatisticsPage',
  )
  const componentModulePath = require.resolve(
    '../src/NavigationPages/StatisticsPage',
  )
  const originalHookModule = require.cache[hookModulePath]

  require.cache[hookModulePath] = {
    exports: {
      useStatisticsPage: () => ({
        isDataAvailable: false,
        locale: {
          noStatistics: 'No statistics available yet',
          streak: {
            best: 'Best streak',
            current: 'Current streak',
            day: 'day',
            days: 'days',
            recoveryAvailable: '1 missed day is forgiven',
            recoveryUsed: 'Next missed day resets the streak',
            title: 'Study streak',
          },
        },
        studyStreak: {
          currentStreak: 0,
          bestStreak: 0,
          isRecoveryDayUsed: false,
        },
      }),
    },
  }
  delete require.cache[componentModulePath]

  try {
    const StatisticsPage = require(componentModulePath).default
    const markup = ReactDOMServer.renderToStaticMarkup(
      React.createElement(StatisticsPage),
    )

    assert.match(markup, /Study streak/)
    assert.match(markup, /Current streak/)
    assert.match(markup, /Best streak/)
    assert.match(markup, /1 missed day is forgiven/)
    assert.match(markup, /whitespace-nowrap/)
    assert.match(markup, /No statistics available yet/)
  } finally {
    delete require.cache[componentModulePath]

    if (originalHookModule) {
      require.cache[hookModulePath] = originalHookModule
    } else {
      delete require.cache[hookModulePath]
    }
  }
})
