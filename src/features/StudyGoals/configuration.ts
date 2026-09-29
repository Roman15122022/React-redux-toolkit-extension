import { StudyGoal, StudyGoalsConfiguration } from './types'
import {
  ALL_STUDY_WEEKDAYS,
  DEFAULT_DAILY_GOAL_MINUTES,
  DEFAULT_MAX_DAILY_MINUTES,
} from './constants'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function isValidMinutes(
  value: unknown,
  maximum: number,
): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= maximum
  )
}

export function isStudyGoalValid(
  value: unknown,
  otherGoals: StudyGoal[],
): value is StudyGoal {
  if (!isRecord(value)) return false

  const { id, kind, targetMinutes, enabled, activityNames } = value

  if (
    typeof id !== 'string' ||
    !id.trim() ||
    typeof kind !== 'string' ||
    !['daily-total', 'weekly-total', 'weekly-activity'].includes(kind) ||
    !isValidMinutes(targetMinutes, kind === 'daily-total' ? 1440 : 10080) ||
    typeof enabled !== 'boolean' ||
    !Array.isArray(activityNames) ||
    !activityNames.every(
      name => typeof name === 'string' && name.length <= 200 && name.trim(),
    )
  ) {
    return false
  }

  const names = activityNames.map(name => name.trim())

  if (new Set(names).size !== names.length) return false

  if (kind === 'weekly-activity' ? !names.length : names.length !== 0) {
    return false
  }

  return !otherGoals.some(
    other =>
      other.id !== id &&
      (kind === 'weekly-activity'
        ? other.activityNames.some(name => names.includes(name.trim()))
        : other.kind === kind),
  )
}

export function isStudyGoalsConfiguration(
  value: unknown,
): value is StudyGoalsConfiguration {
  if (!isRecord(value) || value.version !== 1 || !Array.isArray(value.goals)) {
    return false
  }

  const { goals, studyWeekdays, maxDailyMinutes } = value

  return (
    goals.every(goal => isStudyGoalValid(goal, [])) &&
    new Set(goals.map(goal => (isRecord(goal) ? goal.id : undefined))).size ===
      goals.length &&
    goals.every(goal => isStudyGoalValid(goal, goals as StudyGoal[])) &&
    Array.isArray(studyWeekdays) &&
    studyWeekdays.every(day => Number.isInteger(day) && day >= 0 && day <= 6) &&
    new Set(studyWeekdays).size === studyWeekdays.length &&
    isValidMinutes(maxDailyMinutes, 1440)
  )
}

export function normalizeStudyGoalsConfiguration(
  value: unknown,
  legacyDailyGoalMinutes?: number,
): StudyGoalsConfiguration {
  const base: StudyGoalsConfiguration = {
    version: 1,
    goals: [],
    studyWeekdays: [...ALL_STUDY_WEEKDAYS],
    maxDailyMinutes: DEFAULT_MAX_DAILY_MINUTES,
  }

  if (!isRecord(value) || value.version !== 1) {
    return {
      ...base,
      goals: [
        {
          id: 'daily-total',
          kind: 'daily-total',
          targetMinutes: isValidMinutes(legacyDailyGoalMinutes, 1440)
            ? legacyDailyGoalMinutes
            : DEFAULT_DAILY_GOAL_MINUTES,
          enabled: true,
          activityNames: [],
        },
      ],
    }
  }

  const goals: StudyGoal[] = []

  if (Array.isArray(value.goals)) {
    value.goals.forEach(goal => {
      if (
        isStudyGoalValid(goal, goals) &&
        !goals.some(existing => existing.id === goal.id)
      ) {
        goals.push({
          ...goal,
          activityNames: goal.activityNames.map(name => name.trim()),
        })
      }
    })
  }

  return {
    ...base,
    goals,
    studyWeekdays: Array.isArray(value.studyWeekdays)
      ? [
          ...new Set(
            value.studyWeekdays.filter(
              day => Number.isInteger(day) && day >= 0 && day <= 6,
            ),
          ),
        ]
      : base.studyWeekdays,
    maxDailyMinutes: isValidMinutes(value.maxDailyMinutes, 1440)
      ? value.maxDailyMinutes
      : base.maxDailyMinutes,
  }
}

export function renameStudyGoal(
  goal: StudyGoal,
  activityName: string,
): StudyGoal {
  return {
    ...goal,
    activityNames: [...new Set([activityName.trim(), ...goal.activityNames])],
  }
}
