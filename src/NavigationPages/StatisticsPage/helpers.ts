import { TimePeriod } from '../../types'

import { Period } from './types'

export function getDatesByPeriod(
  dates: TimePeriod[],
  period: Period,
): TimePeriod[] {
  if (period === '0') {
    return dates
  }

  const now = new Date()

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime()

  const endOfToday = startOfToday + 24 * 60 * 60 * 1000 - 1

  let startTime: number
  const periodStr = String(period)

  switch (periodStr) {
    case '1':
      startTime = startOfToday
      break
    case '7':
      startTime = startOfToday - 6 * 24 * 60 * 60 * 1000
      break
    case '30':
      startTime = startOfToday - 29 * 24 * 60 * 60 * 1000
      break
  }

  return dates.filter(
    item => item.endDate >= startTime && item.startDate <= endOfToday,
  )
}
