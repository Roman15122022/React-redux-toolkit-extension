import { TIME_IN_MS, TIME_IN_SECONDS } from '../../constants'

import { INITIAL_TIME } from './constants'

export function formatTime(seconds: number): string {
  if (!seconds) return INITIAL_TIME

  const hours = Math.floor(seconds / TIME_IN_SECONDS.HOUR)
  const minutes = Math.floor(
    (seconds % TIME_IN_SECONDS.HOUR) / TIME_IN_SECONDS.MINUTE,
  )
  const secs = seconds % TIME_IN_SECONDS.MINUTE

  const formattedHours = hours.toString().padStart(2, '0')
  const formattedMinutes = minutes.toString().padStart(2, '0')
  const formattedSeconds = secs.toString().padStart(2, '0')

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}

export function getTimeDifferenceByNow(date: number): number {
  if (!date) return date

  const now = new Date()
  const differenceInMilliseconds = now.getTime() - date

  return Math.floor(differenceInMilliseconds / TIME_IN_MS.SECOND)
}
