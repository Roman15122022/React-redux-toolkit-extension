import { GoalProgress } from './types'
import { STREAK_MILESTONES } from './constants'

export function getCompletedGoalIds(
  before: GoalProgress[],
  after: GoalProgress[],
): string[] {
  return after
    .filter(
      goal =>
        goal.isComplete &&
        before.some(
          previous => previous.goalId === goal.goalId && !previous.isComplete,
        ),
    )
    .map(goal => goal.goalId)
}

export function getNextStreakMilestone(currentStreak: number): number | null {
  return STREAK_MILESTONES.find(milestone => milestone > currentStreak) ?? null
}
