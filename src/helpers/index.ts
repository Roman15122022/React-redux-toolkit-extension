import moment from 'moment/moment'

import { TimePeriod } from '../types'

export function getDataForDefiniteDay(
  timeStamp: number,
  dates: TimePeriod[],
): TimePeriod[] {
  const startOfDay = new Date(timeStamp).setHours(0, 0, 0, 0)
  const endOfDay = new Date(timeStamp).setHours(23, 59, 59, 999)

  return dates.filter(
    period => period.startDate >= startOfDay && period.endDate <= endOfDay,
  )
}

export function getTotalTimeForDate(
  timeStamp: number,
  dates: TimePeriod[],
): number {
  const filteredDates = getDataForDefiniteDay(timeStamp, dates)

  return filteredDates.reduce((total: number, period: TimePeriod) => {
    return total + (period.totalTimeForSession || 0)
  }, 0)
}

export function formatLanguageDate(
  date: number,
  format: string,
  language: string,
): string {
  return moment(date).locale(language).format(format)
}
