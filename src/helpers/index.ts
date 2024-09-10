import { TimePeriod } from '../types'

export function getTotalTimeForDate(
  timestamp: number,
  dates: TimePeriod[],
): number {
  const startOfDay = new Date(timestamp).setHours(0, 0, 0, 0)
  const endOfDay = new Date(timestamp).setHours(23, 59, 59, 999)

  return dates.reduce((total, period) => {
    if (period.startDate >= startOfDay && period.endDate <= endOfDay) {
      return total + (period.totalTimeForSession || 0)
    }

    return total
  }, 0)
}
