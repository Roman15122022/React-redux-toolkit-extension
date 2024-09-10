import moment from 'moment'

import { Language, Locale, TimePeriod } from '../../types'
import { getTotalTimeForDate } from '../../helpers'
import {
  DATE_DAY_FORMAT,
  DATE_TIME_FORMAT,
  TIME_IN_SECONDS,
} from '../../constants'

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

export function customizedTime(time: FormattedTime, locale: Locale): string {
  const { formattedHours, formattedSeconds, formattedMinutes } = time
  const { hours, seconds, minutes } = locale.popup.track

  return `${formattedHours}${hours} ${formattedMinutes}${minutes} ${formattedSeconds}${seconds}`
}

export function customizedPeriod(
  dates: TimePeriod[],
  language: Language,
): string {
  if (!dates.length) return ''

  moment.locale(language)

  const { startDate, endDate } = dates.at(-1)

  const formattedStartDate = moment(startDate).format(DATE_DAY_FORMAT)
  const formattedStartTime = moment(startDate).format(DATE_TIME_FORMAT)
  const formattedEndDate = moment(endDate).format(DATE_DAY_FORMAT)
  const formattedEndTime = moment(endDate).format(DATE_TIME_FORMAT)

  if (formattedStartDate === formattedEndDate) {
    return `${formattedStartDate}, ${formattedStartTime} - ${formattedEndTime}`
  }

  return `${formattedStartDate} ${formattedStartTime} - ${formattedEndDate} ${formattedEndTime}`
}

export function totalElapsedTime(dates: TimePeriod[], locale: Locale): string {
  const now = Date.now()

  const totalTime = getTotalTimeForDate(now, dates)

  const customTime = customizedTime(formatTime(totalTime, false), locale)

  return customTime
    .split(' ')
    .map(item => (item.startsWith('0') ? '' : item))
    .join(' ')
}
