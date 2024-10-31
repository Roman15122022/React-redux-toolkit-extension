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

export function getTotalTimeForActivityName(
  name: string,
  dates: TimePeriod[],
): number {
  return dates
    .filter(date => date.activityName === name)
    .reduce((acc, { totalTimeForSession }) => {
      return acc + totalTimeForSession
    }, 0)
}

export function formatLanguageDate(
  date: number,
  format: string,
  language: string,
): string {
  return moment(date).locale(language).format(format)
}

export function getSegment<T>(
  arr: Array<T>,
  segmentSize: number,
  segmentNumber: number,
): Array<T> {
  const startIndex = (segmentNumber - 1) * segmentSize
  const endIndex = startIndex + segmentSize

  return arr.slice(startIndex, endIndex)
}

export function getUniqNamesActivity(dates: TimePeriod[]): Array<string> {
  const names = dates.map(date => date.activityName).filter(date => date !== '')

  return [...new Set(names)]
}

export function convertToAmericanFormat(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const americanHours = hours % 12 === 0 ? 12 : hours % 12

  return `${String(americanHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`
}
