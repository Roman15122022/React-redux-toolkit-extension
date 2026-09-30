import { TimePeriod } from '../../types'

import { StudyGoal, StudyGoalsConfiguration } from './types'
import { getStudyGoalProgress } from './helpers'

export type SessionGoalProgress = {
  goal: StudyGoal
  completedSeconds: number
  addedSeconds: number
  beforePercent: number
  addedPercent: number
}

export function getSessionGoalProgress(
  sessions: TimePeriod[],
  configuration: StudyGoalsConfiguration,
  session: TimePeriod,
): SessionGoalProgress[] {
  const progress = getStudyGoalProgress(
    sessions,
    configuration,
    session.endDate,
  )
  const contribution = getStudyGoalProgress(
    [session],
    configuration,
    session.endDate,
  )

  return progress.flatMap(item => {
    const goal = configuration.goals.find(
      existing => existing.id === item.goalId,
    )
    const addedSeconds =
      contribution.find(existing => existing.goalId === item.goalId)
        ?.completedSeconds ?? 0

    if (!goal || addedSeconds === 0) return []

    const beforeSeconds = Math.max(0, item.completedSeconds - addedSeconds)
    const beforePercent = Math.min(
      100,
      (beforeSeconds / item.targetSeconds) * 100,
    )
    const afterPercent = Math.min(
      100,
      (item.completedSeconds / item.targetSeconds) * 100,
    )

    return [
      {
        goal,
        completedSeconds: item.completedSeconds,
        addedSeconds,
        beforePercent,
        addedPercent: Math.max(0, afterPercent - beforePercent),
      },
    ]
  })
}
