import moment from 'moment'

import { Locale, TimePeriod } from '../../types'
import {
  customizedTime,
  formatTime,
} from '../../NavigationPages/TrackTimePage/helpers'
import { DATE_SHORT_DAY_FORMAT, DATE_SHORT_TIME_FORMAT } from '../../constants'

import { DaysBasedOnProduct, MinMaxSessions } from './types'

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

function getFinalCustomizedTime(totalTime: number, locale: Locale): string {
  const formattedTime = formatTime(totalTime, false)

  return customizedTime(formattedTime, locale)
}

export function getCustomizeAllTime(
  data: TimePeriod[],
  locale: Locale,
): string {
  const totalTime = getTotalTime(data)

  return getFinalCustomizedTime(totalTime, locale)
}

function getDictionaryWeekDays(locale: Locale): Record<number, string> {
  const dayOfWeekDictionary = locale.popup.dayOfWeek

  return {
    1: dayOfWeekDictionary.sunday,
    2: dayOfWeekDictionary.monday,
    3: dayOfWeekDictionary.tuesday,
    4: dayOfWeekDictionary.wednesday,
    5: dayOfWeekDictionary.thursday,
    6: dayOfWeekDictionary.friday,
    7: dayOfWeekDictionary.saturday,
  }
}

export function getCountSessions(data: TimePeriod[]): string {
  return data.length.toString()
}

export function getAveragePerDay(data: TimePeriod[], locale: Locale): string {
  const totalDays = getTotalDays(data)
  const totalTime = getTotalTime(data)

  const average = Math.round(totalTime / totalDays)

  return getFinalCustomizedTime(average, locale)
}

export function getAveragePerSession(
  data: TimePeriod[],
  totalSessions,
  locale: Locale,
): string {
  const totalTime = getTotalTime(data)
  const average = Math.round(totalTime / totalSessions)

  return getFinalCustomizedTime(average, locale)
}

export function getMinMaxSessionTime(
  data: TimePeriod[],
  locale: Locale,
): MinMaxSessions {
  const sessions = data.map(item => item.totalTimeForSession)

  let [minTimeSessionCounter] = sessions
  let [maxTimeSessionCounter] = sessions

  sessions.forEach(session => {
    if (session > maxTimeSessionCounter) {
      maxTimeSessionCounter = session
    }

    if (session < minTimeSessionCounter) {
      minTimeSessionCounter = session
    }
  })

  return {
    minTimeSession: getFinalCustomizedTime(minTimeSessionCounter, locale),
    maxTimeSession: getFinalCustomizedTime(maxTimeSessionCounter, locale),
  }
}

export function getDaysBasedOnProduct(
  data: TimePeriod[],
  locale: Locale,
): DaysBasedOnProduct {
  const dictionaryDayTime = data.reduce(
    (acc, { dayOfWeek, totalTimeForSession }) => {
      acc[dayOfWeek] = (acc[dayOfWeek] || 0) + totalTimeForSession

      return acc
    },
    {},
  )

  const sortedDataByDays = Object.keys(dictionaryDayTime).sort((a, b) => {
    return dictionaryDayTime[b] - dictionaryDayTime[a]
  })

  const dictionaryWeekDays = getDictionaryWeekDays(locale)

  const mostProductDay = dictionaryWeekDays[sortedDataByDays.at(0)]
  const mostUnProductDay = dictionaryWeekDays[sortedDataByDays.at(-1)]

  return {
    mostProductDay,
    mostUnProductDay:
      mostUnProductDay === mostProductDay ? '-' : mostUnProductDay,
  }
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)

  return hours * 60 + minutes
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

export function findMostProductiveThreeHourPeriod(data: TimePeriod[]): string {
  const periods = data.reduce(
    (acc, { totalTimeForSession, startDate, endDate }) => {
      const start = moment(startDate)
        .locale('uk')
        .format(DATE_SHORT_TIME_FORMAT)
      const end = moment(endDate).locale('uk').format(DATE_SHORT_TIME_FORMAT)

      const period = `${start}-${end}`

      acc[period] = (acc[period] || 0) + totalTimeForSession

      return acc
    },
    {},
  )

  const productivityArray = Array(1440).fill(0)

  for (const period in periods) {
    const [start, end] = period.split('-')
    const startMinutes = timeToMinutes(start)
    const endMinutes = timeToMinutes(end)
    const productivityInMinutes = Math.floor(periods[period] / 60)

    for (let i = 0; i < 1440; i++) {
      const minuteIndex = (startMinutes + i) % 1440

      if (
        i <
        (endMinutes < startMinutes
          ? 1440 - startMinutes + endMinutes
          : endMinutes - startMinutes)
      ) {
        productivityArray[minuteIndex] += productivityInMinutes
      }
    }
  }

  let maxProductivity = 0
  let bestInterval: [number, number] = [0, 0]

  for (let start = 0; start < 1440; start++) {
    for (let duration = 60; duration <= 180; duration++) {
      const end = (start + duration) % 1440
      let totalProductivity = 0

      if (end > start) {
        for (let i = start; i < end; i++) {
          totalProductivity += productivityArray[i]
        }
      } else {
        for (let i = start; i < 1440; i++) {
          totalProductivity += productivityArray[i]
        }
        for (let i = 0; i < end; i++) {
          totalProductivity += productivityArray[i]
        }
      }

      if (totalProductivity > maxProductivity) {
        maxProductivity = totalProductivity
        bestInterval = [start, end]
      }
    }
  }

  const bestStartTime = minutesToTime(bestInterval[0])
  const bestEndTime = minutesToTime(bestInterval[1])

  return `${bestStartTime}${bestStartTime === bestEndTime ? '' : `-${bestEndTime}`}`
}
