import { twMerge } from 'tailwind-merge'
import moment from 'moment/moment'
import { ClassValue, clsx } from 'clsx'

import { Language } from '../types'
import { DATE_DAY_OF_WEEK_FORMAT, dayOfWeekMap, TIME_IN_MS } from '../constants'

export function getDayOfWeekNumber(): number {
  moment.locale(Language.EN)
  const dayOfWeek = moment().format(DATE_DAY_OF_WEEK_FORMAT)

  return dayOfWeekMap[dayOfWeek] || 0
}

export function getTimeDifferenceByNow(date: number): number {
  if (!date) return date

  const now = moment()
  const givenDate = moment(date)
  const differenceInMilliseconds = now.diff(givenDate)

  return Math.floor(differenceInMilliseconds / TIME_IN_MS.SECOND)
}

export function cn(...args: ClassValue[]): string {
  return twMerge(clsx(args))
}

export function fillArr(count: number): Array<number> {
  const arr = []

  for (let i = 1; i <= count; i++) {
    arr.push(i)
  }

  return arr
}
