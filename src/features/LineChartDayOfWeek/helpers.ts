import { TimePeriod } from '../../types'

import { DataChartDayOfWeek } from './types'

export function getChartDataDayOverTime(
  dates: TimePeriod[],
): DataChartDayOfWeek[] {
  if (dates.length === 0) return []

  const dayGroups: { [key: number]: { totalTime: number; count: number } } = {
    1: { totalTime: 0, count: 0 },
    2: { totalTime: 0, count: 0 },
    3: { totalTime: 0, count: 0 },
    4: { totalTime: 0, count: 0 },
    5: { totalTime: 0, count: 0 },
    6: { totalTime: 0, count: 0 },
    7: { totalTime: 0, count: 0 },
  }

  dates.forEach(item => {
    const day = item.dayOfWeek
    const time = item.totalTimeForSession

    if (!dayGroups[day]) {
      dayGroups[day] = { totalTime: 0, count: 0 }
    }

    dayGroups[day].totalTime += time
    dayGroups[day].count += 1
  })

  const result: DataChartDayOfWeek[] = Object.keys(dayGroups).map(day => {
    const dayNumber = Number(day)
    const averageTime = dayGroups[day].totalTime / (dayGroups[day].count || 1)

    return {
      day: dayNumber,
      time: averageTime,
    }
  })

  return result
}
