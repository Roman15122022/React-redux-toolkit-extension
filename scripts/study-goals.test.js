const assert = require('node:assert/strict')
const test = require('node:test')
const filesystem = require('node:fs')
const typescript = require('typescript')

require.extensions['.ts'] = (module, filename) => {
  const source = filesystem.readFileSync(filename, 'utf8')
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

const configurationPath = '../src/features/StudyGoals/configuration.ts'
const getConfigurationHelpers = () => require(configurationPath)

function configuration(goals = []) {
  return {
    version: 1,
    goals,
    studyWeekdays: [0, 1, 2, 3, 4, 5, 6],
    maxDailyMinutes: 180,
  }
}

function goal(id, kind, targetMinutes, activityNames = []) {
  return { id, kind, targetMinutes, activityNames, enabled: true }
}

test('migrates daily target once and preserves explicit deletion', () => {
  const { normalizeStudyGoalsConfiguration } = getConfigurationHelpers()
  const migrated = normalizeStudyGoalsConfiguration(undefined, 90)
  assert.equal(migrated.goals[0].targetMinutes, 90)
  assert.deepEqual(normalizeStudyGoalsConfiguration(migrated, 30), migrated)
  assert.deepEqual(
    normalizeStudyGoalsConfiguration(configuration(), 90).goals,
    [],
  )
  assert.equal(
    normalizeStudyGoalsConfiguration(undefined, NaN).goals[0].targetMinutes,
    60,
  )
})

test('validates targets, total uniqueness, aliases and planning limits', () => {
  const { isStudyGoalValid, isStudyGoalsConfiguration } =
    getConfigurationHelpers()
  const english = goal('english', 'weekly-activity', 300, ['English'])
  assert.equal(isStudyGoalValid(english, []), true)
  for (const targetMinutes of [0, -1, 1.5, NaN, Infinity, 10081]) {
    assert.equal(isStudyGoalValid({ ...english, targetMinutes }, []), false)
  }
  assert.equal(
    isStudyGoalValid(goal('other', 'weekly-activity', 30, ['English']), [
      english,
    ]),
    false,
  )
  assert.equal(
    isStudyGoalValid(goal('other', 'daily-total', 30), [
      goal('daily', 'daily-total', 60),
    ]),
    false,
  )
  assert.equal(
    isStudyGoalsConfiguration({ ...configuration(), maxDailyMinutes: 0 }),
    false,
  )
  assert.equal(
    isStudyGoalsConfiguration({ ...configuration(), studyWeekdays: [] }),
    true,
  )
  assert.equal(
    isStudyGoalsConfiguration({ ...configuration(), studyWeekdays: [7] }),
    false,
  )
})

test('rename preserves old activity names without mutating the source', () => {
  const { renameStudyGoal } = getConfigurationHelpers()
  const english = goal('english', 'weekly-activity', 300, ['English'])
  assert.deepEqual(renameStudyGoal(english, ' English B2 ').activityNames, [
    'English B2',
    'English',
  ])
  assert.deepEqual(english.activityNames, ['English'])
})

test('settings actions normalize legacy replacement and reject conflicting goals', () => {
  const {
    default: reducer,
    settingSlice,
  } = require('../src/store/reducers/settingReducer/SettingSlice.ts')
  let settings = reducer(undefined, { type: 'initial' })
  settings = reducer(
    settings,
    settingSlice.actions.setSettingsState({
      ...settings,
      studyGoals: undefined,
      dailyGoalMinutes: 90,
    }),
  )
  assert.equal(settings.studyGoals.goals[0].targetMinutes, 90)
  settings = reducer(
    settings,
    settingSlice.actions.deleteStudyGoal(settings.studyGoals.goals[0].id),
  )
  assert.equal(settings.studyGoals.goals.length, 0)
  settings = reducer(
    settings,
    settingSlice.actions.saveStudyGoal(goal('week', 'weekly-total', 600)),
  )
  settings = reducer(
    settings,
    settingSlice.actions.saveStudyGoal(goal('week2', 'weekly-total', 300)),
  )
  assert.equal(settings.studyGoals.goals.length, 1)
  settings = reducer(
    settings,
    settingSlice.actions.setStudyGoalEnabled({
      goalId: 'week',
      enabled: false,
    }),
  )
  assert.equal(settings.studyGoals.goals[0].enabled, false)
})

module.exports = { configuration, goal }

test('rejects a malformed goal next to a valid goal without throwing', () => {
  const { isStudyGoalsConfiguration } = getConfigurationHelpers()
  assert.equal(
    isStudyGoalsConfiguration(
      configuration([goal('day', 'daily-total', 60), null]),
    ),
    false,
  )
})

const getProgressHelpers = () =>
  require('../src/features/StudyGoals/helpers.ts')
const getPlanningHelpers = () =>
  require('../src/features/StudyGoals/planning.ts')
const now = new Date(2026, 8, 29, 12).getTime()
function session(endDate, minutes, activityName = 'English') {
  return {
    startDate: endDate - minutes * 60000,
    endDate,
    totalTimeForSession: minutes * 60,
    activityName,
    dayOfWeek: 2,
    mood: '3',
  }
}

test('derives completed daily and weekly goals with safe boundaries', () => {
  const { getStudyGoalProgress } = getProgressHelpers()
  const settings = configuration([
    goal('day', 'daily-total', 60),
    goal('week', 'weekly-total', 180),
    goal('english', 'weekly-activity', 60, ['English B2', 'English']),
  ])
  const sessions = [
    session(now, 30),
    session(new Date(2026, 8, 28, 12).getTime(), 90),
    session(new Date(2026, 8, 27, 12).getTime(), 100),
    session(now + 3600000, 100),
    session(now, -30),
  ]
  const progress = getStudyGoalProgress(sessions, settings, now)
  assert.equal(progress[0].completedSeconds, 1800)
  assert.equal(progress[0].percent, 50)
  assert.equal(progress[1].completedSeconds, 7200)
  assert.equal(progress[2].isComplete, true)
  assert.equal(progress[2].remainingSeconds, 0)
  assert.equal(progress[2].percent, 100)
  assert.deepEqual(
    getStudyGoalProgress([], settings, now).map(item => item.completedSeconds),
    [0, 0, 0],
  )
  settings.goals[0].enabled = false
  assert.equal(getStudyGoalProgress(sessions, settings, now).length, 2)
})

test('counts a midnight-crossing session on its completion day', () => {
  const { getStudyGoalProgress } = getProgressHelpers()
  const afterMidnight = new Date(2026, 8, 29, 0, 15).getTime()
  assert.equal(
    getStudyGoalProgress(
      [session(afterMidnight, 30)],
      configuration([goal('day', 'daily-total', 60)]),
      afterMidnight,
    )[0].completedSeconds,
    1800,
  )
})

test('uses local calendar boundaries over DST and in different timezones', () => {
  const originalTimezone = process.env.TZ
  const { getStudyGoalProgress, getLocalWeekBounds } = getProgressHelpers()
  try {
    process.env.TZ = 'Europe/Chisinau'
    const sunday = new Date(2026, 9, 25, 23, 45).getTime()
    const bounds = getLocalWeekBounds(sunday)
    assert.equal(new Date(bounds.start).getDay(), 1)
    assert.equal(bounds.end - bounds.start, (7 * 24 + 1) * 3600000)
    assert.equal(
      getStudyGoalProgress(
        [session(sunday, 30)],
        configuration([goal('day', 'daily-total', 60)]),
        sunday,
      )[0].completedSeconds,
      1800,
    )
    process.env.TZ = 'America/New_York'
    const morning = Date.parse('2026-09-29T02:00:00Z')
    assert.equal(
      getStudyGoalProgress(
        [session(morning - 3600000, 10)],
        configuration([goal('day', 'daily-total', 60)]),
        morning,
      )[0].completedSeconds,
      600,
    )
  } finally {
    if (originalTimezone === undefined) delete process.env.TZ
    else process.env.TZ = originalTimezone
  }
})

test('weekly planning avoids double-counting total and activity demand', () => {
  const { getWeeklyStudyPlan } = getPlanningHelpers()
  const settings = configuration([
    goal('week', 'weekly-total', 120),
    goal('english', 'weekly-activity', 60, ['English']),
  ])
  const plan = getWeeklyStudyPlan([], settings, now)
  assert.equal(
    plan.days.reduce((total, day) => total + day.totalSeconds, 0),
    7200,
  )
  assert.equal(
    plan.days.reduce(
      (total, day) =>
        total +
        day.activitySeconds.reduce((sum, item) => sum + item.seconds, 0),
      0,
    ),
    3600,
  )
  assert.equal(plan.unscheduledSeconds, 0)
  assert.deepEqual(getWeeklyStudyPlan([], settings, now), plan)
  assert.equal(settings.goals[0].targetMinutes, 120)
})

test('activity demands can exceed total target but never daily capacity', () => {
  const { getWeeklyStudyPlan } = getPlanningHelpers()
  const sunday = new Date(2026, 9, 4, 12).getTime()
  const settings = {
    ...configuration([
      goal('week', 'weekly-total', 120),
      goal('english', 'weekly-activity', 90, ['English']),
      goal('coding', 'weekly-activity', 90, ['Coding']),
    ]),
    maxDailyMinutes: 60,
  }
  const plan = getWeeklyStudyPlan(
    [session(sunday, 30, 'Other')],
    settings,
    sunday,
  )
  assert.equal(plan.days[0].totalSeconds, 1800)
  assert.equal(plan.unscheduledSeconds, 9000)
  assert.equal(
    plan.unscheduledByGoal
      .filter(item => item.goalId !== 'week')
      .reduce((total, item) => total + item.seconds, 0),
    9000,
  )
  assert.equal(plan.days[0].generalSeconds, 0)
})

test('reports unavailable days, completed goals and exhausted daily capacity', () => {
  const { getWeeklyStudyPlan } = getPlanningHelpers()
  const settings = {
    ...configuration([goal('week', 'weekly-total', 60)]),
    studyWeekdays: [],
  }
  assert.equal(getWeeklyStudyPlan([], settings, now).unscheduledSeconds, 3600)
  assert.deepEqual(
    getWeeklyStudyPlan([session(now, 60)], settings, now).days,
    [],
  )
  const sunday = new Date(2026, 9, 4, 12).getTime()
  settings.studyWeekdays = [0]
  settings.maxDailyMinutes = 30
  const plan = getWeeklyStudyPlan([session(sunday, 45)], settings, sunday)
  assert.equal(plan.days[0].totalSeconds, 0)
  assert.equal(plan.unscheduledSeconds, 900)
})

test('celebrates only newly crossed targets and supplies next streak milestone', () => {
  const {
    getCompletedGoalIds,
    getNextStreakMilestone,
  } = require('../src/features/StudyGoals/milestones.ts')
  assert.deepEqual(
    getCompletedGoalIds(
      [{ goalId: 'day', isComplete: false }],
      [{ goalId: 'day', isComplete: true }],
    ),
    ['day'],
  )
  assert.deepEqual(
    getCompletedGoalIds(
      [{ goalId: 'day', isComplete: true }],
      [{ goalId: 'day', isComplete: true }],
    ),
    [],
  )
  assert.deepEqual(
    getCompletedGoalIds([], [{ goalId: 'new', isComplete: true }]),
    [],
  )
  assert.equal(getNextStreakMilestone(7), 14)
  assert.equal(getNextStreakMilestone(30), null)
})

test('rejects an array-shaped goal kind in imported JSON', () => {
  const { isStudyGoalsConfiguration, normalizeStudyGoalsConfiguration } =
    getConfigurationHelpers()
  const damaged = configuration([
    { ...goal('damaged', 'weekly-activity', 60), kind: ['weekly-activity'] },
  ])
  assert.equal(isStudyGoalsConfiguration(damaged), false)
  assert.deepEqual(normalizeStudyGoalsConfiguration(damaged).goals, [])
})
