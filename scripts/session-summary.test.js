const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
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

const {
  createSessionSummary,
  getSessionDomainData,
} = require('../src/features/SessionSummary/helpers')
const historyHelpers = require('../src/NavigationPages/HistoryPage/helpers')

test('does not format a heading when no history date is selected', () => {
  assert.equal(
    typeof historyHelpers.getFullMonthSelectedDate,
    'function',
    'History date formatter must handle an empty selection',
  )
  assert.equal(historyHelpers.getFullMonthSelectedDate(0, 'en'), undefined)
})

test('does not render arrow markers in session history rows', () => {
  const componentSource = fs.readFileSync(
    path.resolve(__dirname, '../src/features/StudyTimeInfoForDay/index.tsx'),
    'utf8',
  )

  assert.doesNotMatch(componentSource, /›/)
})

test('renders a compact day total before session rows', () => {
  const React = require('react')
  const ReactDOMServer = require('react-dom/server')
  const hookModulePath = require.resolve(
    '../src/features/StudyTimeInfoForDay/useStudyTimeInfoForDay',
  )
  const componentModulePath = require.resolve(
    '../src/features/StudyTimeInfoForDay',
  )
  const originalHookModule = require.cache[hookModulePath]

  require.cache[hookModulePath] = {
    exports: {
      useStudyTimeInfoForDay: () => ({
        locale: { dayTotal: 'Day total', totalForDay: 'Daily total' },
        periods: [
          {
            activityName: 'English',
            period: '9:00 AM – 9:10 AM',
            source: {},
          },
        ],
        summaryLocale: { openReport: 'Open session report' },
        totalForDay: '10m',
      }),
    },
  }
  delete require.cache[componentModulePath]

  try {
    const StudyTimeInfoForDay = require(componentModulePath).default
    const markup = ReactDOMServer.renderToStaticMarkup(
      React.createElement(StudyTimeInfoForDay, {
        compactTotal: true,
        date: 1,
        heading: 'September 12',
        isLastTimeNeeded: false,
      }),
    )

    assert.match(markup, /September 12/)
    assert.match(markup, /Day total/)
    assert.match(markup, /10m/)
    assert.ok(markup.indexOf('Day total') < markup.indexOf('English'))
    assert.doesNotMatch(markup, /Daily total/)
  } finally {
    delete require.cache[componentModulePath]

    if (originalHookModule) {
      require.cache[hookModulePath] = originalHookModule
    } else {
      delete require.cache[hookModulePath]
    }
  }
})

test('calculates distracting time only from domains marked as distracting', () => {
  const session = {
    activityName: 'Programming',
    startDate: 1_000_000,
    endDate: 4_600_000,
    dayOfWeek: 1,
    totalTimeForSession: 3600,
    mood: '4',
    pauseCount: 1,
  }
  const domainSessions = [
    {
      domain: 'github.com',
      fullDomain: 'github.com',
      startTime: new Date(1_000_000).toISOString(),
      endTime: new Date(2_200_000).toISOString(),
      duration: 1_200_000,
    },
    {
      domain: 'youtube.com',
      fullDomain: 'youtube.com',
      startTime: new Date(2_200_000).toISOString(),
      endTime: new Date(2_800_000).toISOString(),
      duration: 600_000,
    },
  ]

  const summary = createSessionSummary({
    session,
    history: [],
    domainSessions,
    distractingDomains: ['youtube.com'],
  })

  assert.equal(summary.distractingTimeSeconds, 600)
  assert.equal(summary.productiveTimeSeconds, 3000)
  assert.equal(summary.domainTimeAvailable, true)
})

test('creates an explainable deterministic focus score', () => {
  const session = {
    activityName: 'Programming',
    startDate: 1_000_000,
    endDate: 4_600_000,
    dayOfWeek: 1,
    totalTimeForSession: 3600,
    mood: '4',
    pauseCount: 1,
  }
  const domainSessions = [
    {
      domain: 'youtube.com',
      fullDomain: 'youtube.com',
      startTime: new Date(1_000_000).toISOString(),
      endTime: new Date(1_600_000).toISOString(),
      duration: 600_000,
    },
  ]

  const summary = createSessionSummary({
    session,
    history: [],
    domainSessions,
    distractingDomains: ['youtube.com'],
  })

  assert.equal(summary.focusScore, 87)
  assert.equal(summary.focusLevel, 'excellent')
  assert.deepEqual(
    summary.factors.map(factor => factor.key),
    ['productiveTime', 'mood', 'distractions', 'pauses'],
  )
})

test('uses neutral score weights when domain data and history are unavailable', () => {
  const summary = createSessionSummary({
    session: {
      activityName: 'Reading',
      startDate: 1_000_000,
      endDate: 2_500_000,
      dayOfWeek: 1,
      totalTimeForSession: 1500,
      mood: '3',
      pauseCount: 0,
    },
    history: [],
    domainSessions: [],
    distractingDomains: [],
  })

  assert.equal(summary.domainTimeAvailable, false)
  assert.equal(summary.focusScore, 92)
  assert.equal(summary.comparison.recentAverageDelta, null)
  assert.equal(summary.comparison.previousSessionDelta, null)
})

test('compares the score with recent average and previous session', () => {
  const history = [
    {
      activityName: 'Reading',
      startDate: 100,
      endDate: 200,
      dayOfWeek: 1,
      totalTimeForSession: 3600,
      mood: '3',
      focusScore: 80,
    },
    {
      activityName: 'Planning',
      startDate: 300,
      endDate: 400,
      dayOfWeek: 1,
      totalTimeForSession: 3600,
      mood: '3',
      focusScore: 70,
    },
  ]

  const summary = createSessionSummary({
    session: {
      activityName: 'Programming',
      startDate: 1_000_000,
      endDate: 4_600_000,
      dayOfWeek: 1,
      totalTimeForSession: 3600,
      mood: '4',
      pauseCount: 1,
    },
    history,
    domainSessions: [],
    distractingDomains: [],
  })

  assert.equal(summary.focusScore, 93)
  assert.equal(summary.comparison.recentAverageDelta, 18)
  assert.equal(summary.comparison.previousSessionDelta, 23)
})

test('recommends removing the top distracting domain from the next focus block', () => {
  const summary = createSessionSummary({
    session: {
      activityName: 'Programming',
      startDate: 1_000_000,
      endDate: 4_000_000,
      dayOfWeek: 1,
      totalTimeForSession: 3000,
      mood: '4',
      pauseCount: 0,
    },
    history: [],
    domainSessions: [
      {
        domain: 'youtube.com',
        fullDomain: 'youtube.com',
        startTime: new Date(1_000_000).toISOString(),
        endTime: new Date(1_900_000).toISOString(),
        duration: 900_000,
      },
    ],
    distractingDomains: ['youtube.com'],
  })

  assert.deepEqual(summary.recommendation, {
    type: 'reduceDistractions',
    domain: 'youtube.com',
    minutes: 25,
  })
})

test('keeps only domain records that overlap the completed timer session', () => {
  const session = {
    activityName: 'Programming',
    startDate: 1_000_000,
    endDate: 2_000_000,
    dayOfWeek: 1,
    totalTimeForSession: 1000,
    mood: '4',
  }
  const domainSessions = [
    {
      domain: 'github.com',
      fullDomain: 'github.com',
      startTime: new Date(900_000).toISOString(),
      endTime: new Date(1_100_000).toISOString(),
      duration: 200_000,
    },
    {
      domain: 'example.com',
      fullDomain: 'example.com',
      startTime: new Date(2_100_000).toISOString(),
      endTime: new Date(2_200_000).toISOString(),
      duration: 100_000,
    },
  ]

  assert.deepEqual(getSessionDomainData(session, domainSessions), [
    domainSessions[0],
  ])
})

test('does not describe a very short session as good focus', () => {
  const summary = createSessionSummary({
    session: {
      activityName: 'Quick check',
      startDate: 1_000_000,
      endDate: 1_007_000,
      dayOfWeek: 1,
      totalTimeForSession: 7,
      mood: '3',
      pauseCount: 0,
    },
    history: [],
    domainSessions: [],
    distractingDomains: [],
  })

  assert.equal(summary.focusLevel, 'mixed')
  assert.equal(
    summary.factors.some(factor => factor.key === 'shortSession'),
    true,
  )
})
