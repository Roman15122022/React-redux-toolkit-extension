const assert = require('node:assert/strict')
const test = require('node:test')
const filesystem = require('node:fs')
const typescript = require('typescript')
for (const extension of ['.ts', '.tsx']) {
  require.extensions[extension] = (module, filename) => {
    module._compile(
      typescript.transpileModule(filesystem.readFileSync(filename, 'utf8'), {
        compilerOptions: {
          esModuleInterop: true,
          jsx: typescript.JsxEmit.React,
          module: typescript.ModuleKind.CommonJS,
          target: typescript.ScriptTarget.ES2021,
        },
        fileName: filename,
      }).outputText,
      filename,
    )
  }
}
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const locale = require('../src/locales/en.json').studyGoals
const { Provider } = require('react-redux')
const { configureStore } = require('@reduxjs/toolkit')
const state = {
  SettingReducer: {
    language: 'en',
    dailyGoalMinutes: 60,
    studyGoals: {
      version: 1,
      studyWeekdays: [1, 2, 3, 4, 5],
      maxDailyMinutes: 180,
      goals: [
        {
          id: 'day',
          kind: 'daily-total',
          targetMinutes: 60,
          enabled: true,
          activityNames: [],
        },
        {
          id: 'week',
          kind: 'weekly-total',
          targetMinutes: 300,
          enabled: true,
          activityNames: [],
        },
        {
          id: 'english',
          kind: 'weekly-activity',
          targetMinutes: 120,
          enabled: true,
          activityNames: ['English'],
        },
      ],
    },
  },
  TimerLogsReducer: { dates: [] },
}
function renderWithStore(component) {
  const store = configureStore({ reducer: () => state })
  return renderToStaticMarkup(
    React.createElement(Provider, { store }, component),
  )
}

test('empty progress keeps goal management visible without a fake target', () => {
  const {
    StudyGoalsView,
  } = require('../src/features/StudyGoals/GoalProgress.tsx')
  const markup = renderToStaticMarkup(
    React.createElement(StudyGoalsView, {
      locale,
      configuration: {
        version: 1,
        goals: [],
        studyWeekdays: [],
        maxDailyMinutes: 180,
      },
      progress: [],
      onManage: () => {},
      compact: true,
    }),
  )
  assert.match(markup, /Set a study goal/)
  assert.match(markup, /button/)
  assert.doesNotMatch(markup, /role="progressbar"/)
})

test('completed goal exposes accessible bounded progress and a full activity name', () => {
  const {
    StudyGoalsView,
  } = require('../src/features/StudyGoals/GoalProgress.tsx')
  const markup = renderToStaticMarkup(
    React.createElement(StudyGoalsView, {
      locale,
      configuration: {
        version: 1,
        goals: [
          {
            id: 'english',
            kind: 'weekly-activity',
            targetMinutes: 60,
            enabled: true,
            activityNames: ['English B2'],
          },
        ],
        studyWeekdays: [],
        maxDailyMinutes: 180,
      },
      progress: [
        {
          goalId: 'english',
          completedSeconds: 7200,
          targetSeconds: 3600,
          remainingSeconds: 0,
          percent: 100,
          isComplete: true,
        },
      ],
      onManage: () => {},
      compact: false,
    }),
  )
  assert.match(markup, /English B2/)
  assert.match(markup, /aria-valuenow="100"/)
  assert.match(markup, /Complete/)
  assert.match(markup, /This week/)
})

test('settings offers total and activity goals plus separately labelled load limits', () => {
  const GoalSettings =
    require('../src/features/StudyGoals/GoalSettings.tsx').default
  const markup = renderWithStore(React.createElement(GoalSettings))
  assert.match(markup, /Daily total/)
  assert.match(markup, /Weekly total/)
  assert.match(markup, /Weekly activity/)
  assert.match(markup, /Maximum minutes per day/)
  assert.match(markup, /Disable/)
})

test('weekly plan displays fractional minutes without exceeding the visible daily cap', () => {
  const WeeklyPlan =
    require('../src/features/StudyGoals/WeeklyPlan.tsx').default
  const activityGoals = Array.from({ length: 6 }, (_, index) => ({
    id: `activity-${index}`,
    kind: 'weekly-activity',
    targetMinutes: 1,
    enabled: true,
    activityNames: [`Activity ${index}`],
  }))
  const markup = renderToStaticMarkup(
    React.createElement(WeeklyPlan, {
      locale,
      language: 'en',
      configuration: {
        version: 1,
        goals: activityGoals,
        studyWeekdays: [1, 2, 3, 4, 5],
        maxDailyMinutes: 1,
      },
      plan: {
        days: [
          {
            dateKey: '2026-09-29',
            totalSeconds: 60,
            activitySeconds: activityGoals.map(goal => ({
              goalId: goal.id,
              seconds: 10,
            })),
            generalSeconds: 0,
          },
        ],
        unscheduledSeconds: 0,
        unscheduledByGoal: [],
      },
    }),
  )
  assert.equal((markup.match(/10 sec/g) ?? []).length, 6)
  assert.equal((markup.match(/1 min/g) ?? []).length, 1)
})
