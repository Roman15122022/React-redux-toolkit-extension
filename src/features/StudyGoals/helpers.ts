import { TimePeriod } from '../../types'

import { GoalProgress, StudyGoalsConfiguration } from './types'

export function getLocalDayStart(timestamp: number): number {
  const date = new Date(timestamp)

  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

export function getNextLocalDay(timestamp: number): number {
  const date = new Date(timestamp)

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1,
  ).getTime()
}

export function getLocalDateKey(timestamp: number): string {
  const date = new Date(timestamp)

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function getLocalWeekBounds(now: number): {
  start: number
  end: number
} {
  const date = new Date(now)
  const daysSinceMonday = (date.getDay() + 6) % 7
  const start = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - daysSinceMonday,
  ).getTime()
  const end = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - daysSinceMonday + 7,
  ).getTime()

  return { start, end }
}

export function getValidCompletedSessions(
  sessions: TimePeriod[],
  now: number,
): TimePeriod[] {
  return sessions.filter(
    session =>
      Number.isFinite(session.endDate) &&
      session.endDate > 0 &&
      session.endDate <= now &&
      Number.isFinite(session.totalTimeForSession) &&
      session.totalTimeForSession > 0,
  )
}

export function getStudyGoalProgress(
  sessions: TimePeriod[],
  configuration: StudyGoalsConfiguration,
  now: number,
): GoalProgress[] {
  const completedSessions = getValidCompletedSessions(sessions, now)
  const dayStart = getLocalDayStart(now)
  const week = getLocalWeekBounds(now)

  return configuration.goals
    .filter(goal => goal.enabled)
    .map(goal => {
      const start = goal.kind === 'daily-total' ? dayStart : week.start
      const end = goal.kind === 'daily-total' ? getNextLocalDay(now) : week.end
      const completedSeconds = completedSessions.reduce((total, session) => {
        const matchesPeriod = session.endDate >= start && session.endDate < end
        const matchesActivity =
          goal.kind !== 'weekly-activity' ||
          goal.activityNames.includes(session.activityName.trim())

        return matchesPeriod && matchesActivity
          ? total + session.totalTimeForSession
          : total
      }, 0)
      const targetSeconds = goal.targetMinutes * 60

      return {
        goalId: goal.id,
        completedSeconds,
        targetSeconds,
        remainingSeconds: Math.max(0, targetSeconds - completedSeconds),
        percent: Math.min(
          100,
          Math.floor((completedSeconds / targetSeconds) * 100),
        ),
        isComplete: completedSeconds >= targetSeconds,
      }
    })
}
