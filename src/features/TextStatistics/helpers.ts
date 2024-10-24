import moment from 'moment'

import { Locale, TimePeriod } from '../../types'
import {
  customizedTime,
  formatTime,
} from '../../NavigationPages/TrackTimePage/helpers'
import { DATE_SHORT_DAY_FORMAT } from '../../constants'

function getTotalTime(data: TimePeriod[]): number {
  return data.reduce((acc, { totalTimeForSession }) => {
    acc += totalTimeForSession

    return acc
  }, 0)
}

function getTotalDays(data: TimePeriod[]): number {
  const arrDates = data.map(item => {
    return moment(item.endDate).format(DATE_SHORT_DAY_FORMAT)
  })

  return [...new Set(arrDates)].length
}

export function getCustomizeAllTime(
  data: TimePeriod[],
  locale: Locale,
): string {
  const totalTime = getTotalTime(data)

  const formattedTime = formatTime(totalTime)

  return customizedTime(formattedTime, locale)
}

export function getCountSessions(data: TimePeriod[]): string {
  return data.length.toString()
}

export function getAveragePerDay(data: TimePeriod[], locale: Locale): string {
  const totalDays = getTotalDays(data)
  const totalTime = getTotalTime(data)

  const average = Math.round(totalTime / totalDays)

  const formattedTime = formatTime(average, false)

  return customizedTime(formattedTime, locale)
}

export function getAveragePerSession(
  data: TimePeriod[],
  totalSessions,
  locale: Locale,
): string {
  const totalTime = getTotalTime(data)
  const average = Math.round(totalTime / totalSessions)

  const formattedTime = formatTime(average, false)

  return customizedTime(formattedTime, locale)
}
