import { Locale, TimePeriod } from '../../types'
import { getMoodLabels } from '../../helpers'

import { DataChart } from './types'

export function getChartData(
  dates: TimePeriod[],
  locale: Locale['popup'],
): DataChart[] {
  if (dates.length === 0) return []

  const moodLabels = getMoodLabels(locale)

  const moodGroups: { [key: number]: { totalTime: number; count: number } } = {
    1: { totalTime: 0, count: 0 },
    2: { totalTime: 0, count: 0 },
    3: { totalTime: 0, count: 0 },
    4: { totalTime: 0, count: 0 },
    5: { totalTime: 0, count: 0 },
  }

  dates.forEach(item => {
    const mood = Number(item.mood) ?? 3
    const time = item.totalTimeForSession

    if (!moodGroups[mood]) {
      moodGroups[mood] = { totalTime: 0, count: 0 }
    }

    moodGroups[mood].totalTime += time
    moodGroups[mood].count += 1
  })

  return Object.keys(moodGroups).map(mood => {
    const moodNumber = Number(mood)
    const averageTime =
      moodGroups[mood].totalTime / (moodGroups[mood].count || 1)

    return {
      mood: `${moodLabels[moodNumber]}`,
      time: averageTime,
    }
  })
}
