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
