import { Locale, TimePeriod } from '../../types'
import { getDayLabels } from '../../helpers'

import { DataChartDayMood } from './types'

export function getChartDataMoodOverDayWeek(
  dates: TimePeriod[],
  locale: Locale['popup'],
): DataChartDayMood[] {
  if (dates.length === 0) return []

  const dayLabels = getDayLabels(locale)

  const dayMoodGroups: { [key: number]: { totalMood: number; count: number } } =
    {
      1: { totalMood: 0, count: 0 },
      2: { totalMood: 0, count: 0 },
      3: { totalMood: 0, count: 0 },
      4: { totalMood: 0, count: 0 },
      5: { totalMood: 0, count: 0 },
      6: { totalMood: 0, count: 0 },
      7: { totalMood: 0, count: 0 },
    }

  dates.forEach(item => {
    const mood = Number(item.mood) || 3
    const day = Number(item.dayOfWeek)

    if (!dayMoodGroups[day]) {
      dayMoodGroups[day] = { totalMood: 0, count: 0 }
    }

    dayMoodGroups[day].totalMood += mood
    dayMoodGroups[day].count += 1
  })

  return Object.keys(dayMoodGroups).map(dayNumber => {
    const averageMoodInCurrentDay = Math.round(
      dayMoodGroups[dayNumber].totalMood /
        (dayMoodGroups[dayNumber].count || 1),
    )

    return {
      day: dayLabels[dayNumber],
      mood: averageMoodInCurrentDay,
    }
  })
}
