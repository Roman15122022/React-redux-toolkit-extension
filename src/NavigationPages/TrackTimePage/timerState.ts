import { TimePeriod } from '../../types'
import { CurrentTimer } from '../../store/reducers/currentTimerReducer/types'
import { TIME_IN_MS } from '../../constants'

export function getElapsedSeconds(
  timer: Pick<CurrentTimer, 'startDate' | 'elapsedTime' | 'stateTimer'>,
  now: number,
): number {
  if (!timer.stateTimer?.isActive || timer.stateTimer.isPause) {
    return Math.max(0, timer.elapsedTime)
  }

  return Math.max(0, Math.floor((now - timer.startDate) / TIME_IN_MS.SECOND))
}

export function getResumeStartDate(
  now: number,
  elapsedSeconds: number,
): number {
  return now - elapsedSeconds * TIME_IN_MS.SECOND
}

export function getDailyGoalProgress(
  sessions: Pick<TimePeriod, 'endDate' | 'totalTimeForSession'>[],
  currentSessionSeconds: number,
  goalMinutes: number,
  now: number,
): { seconds: number; goalSeconds: number; percent: number } {
  const currentDate = new Date(now)
  const startOfDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
  ).getTime()
  const seconds =
    sessions.reduce(
      (total, session) =>
        session.endDate >= startOfDay && session.endDate <= now
          ? total + session.totalTimeForSession
          : total,
      0,
    ) + currentSessionSeconds
  const goalSeconds = Math.max(1, goalMinutes) * 60

  return {
    seconds,
    goalSeconds,
    percent: Math.min(100, Math.floor((seconds / goalSeconds) * 100)),
  }
}
