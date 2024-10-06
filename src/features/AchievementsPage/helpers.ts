import { customizedTime, formatTime } from '../TrackTimePage/helpers'
import { Locale } from '../../types'
import { TIME_IN_SECONDS } from '../../constants'

import { EXPERT, SPECIALIST } from './constants'

export function getCustomizedTime(
  totalTimeInSeconds: number,
  interfaceLang: Locale,
): string {
  return customizedTime(formatTime(totalTimeInSeconds, false), interfaceLang)
    .split(' ')
    .map(item => (item.startsWith('0') ? '' : item))
    .join(' ')
}

export function getPercentByTime(
  totalTime: number,
  isSpecialist: boolean,
): number {
  const specialistInSecond = SPECIALIST * TIME_IN_SECONDS.HOUR
  const expertInSecond = EXPERT * TIME_IN_SECONDS.HOUR

  if (isSpecialist) {
    return parseFloat(((totalTime / expertInSecond) * 100).toFixed(2))
  }

  return parseFloat(((totalTime / specialistInSecond) * 100).toFixed(2))
}

export function getHours(totalTime: number): string {
  const hours = totalTime / 3600

  return hours.toFixed(2)
}
