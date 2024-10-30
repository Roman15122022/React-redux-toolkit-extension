import moment from 'moment'

import { Locale, TimePeriod } from '../../types'
import {
  customizedTime,
  formatTime,
} from '../../NavigationPages/TrackTimePage/helpers'
import { DATE_SHORT_DAY_FORMAT } from '../../constants'

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
    mostUnProductDay,
  }
}
