import { Locale } from '../../types'
import { TIME_IN_SECONDS } from '../../constants'

import { FormattedTime } from './types'
import { INITIAL_TIME } from './constants'

export function formatTime(
  seconds: number,
  includeLeadingZeros = true,
): FormattedTime {
  if (!seconds) return INITIAL_TIME

  const hours = Math.floor(seconds / TIME_IN_SECONDS.HOUR)
  const minutes = Math.floor(
    (seconds % TIME_IN_SECONDS.HOUR) / TIME_IN_SECONDS.MINUTE,
  )
  const secs = seconds % TIME_IN_SECONDS.MINUTE

  const formatNumber = (num: number): string => {
    if (includeLeadingZeros) {
      return num.toString().padStart(2, '0')
    }

    return num.toString()
  }

  const formattedHours = formatNumber(hours)
  const formattedMinutes = formatNumber(minutes)
  const formattedSeconds = formatNumber(secs)

  return { formattedHours, formattedMinutes, formattedSeconds }
}

export function customizedTime(
  time: FormattedTime,
  locale: Locale,
  includingZero = true,
): string {
  const { formattedHours, formattedSeconds, formattedMinutes } = time
  const { hours, seconds, minutes } = locale.popup.track

  if (includingZero) {
    return `${formattedHours}${hours} ${formattedMinutes}${minutes} ${formattedSeconds}${seconds}`
  }

  return [
    Number(formattedHours) > 0 ? `${formattedHours}${hours}` : '',
    Number(formattedMinutes) > 0 ? `${formattedMinutes}${minutes}` : '',
    Number(formattedSeconds) > 0 ? `${formattedSeconds}${seconds}` : '',
  ]
    .filter(Boolean)
    .join(' ')
}

export const fullFormatTime = (
  seconds: number,
  locale: Locale,
  includeLeadingZeros = true,
): string => {
  const formatted = formatTime(seconds, includeLeadingZeros)

  return customizedTime(formatted, locale, false)
}
