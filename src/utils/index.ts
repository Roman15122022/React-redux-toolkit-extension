import moment from 'moment/moment'

import { Language } from '../types'
import { DATE_DAY_OF_WEEK_FORMAT, dayOfWeekMap, TIME_IN_MS } from '../constants'

export function getDayOfWeekNumber(): number {
  moment.locale(Language.EN)
  const dayOfWeek = moment().format(DATE_DAY_OF_WEEK_FORMAT)

  return dayOfWeekMap[dayOfWeek] || 0
}

export function getTimeDifferenceByNow(date: number): number {
  if (!date) return date

  const now = new Date()
  const differenceInMilliseconds = now.getTime() - date

  return Math.floor(differenceInMilliseconds / TIME_IN_MS.SECOND)
}
