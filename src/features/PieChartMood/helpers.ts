import { TimePeriod } from '../../types'

export function getValueForMoods(
  periods: TimePeriod[],
): Record<string, number> {
  if (periods.length === 0) return {}

  const counts = periods.reduce((acc: Record<number, number>, { mood }) => {
    acc[mood] = (acc[mood] || 0) + 1

    return acc
  }, {})

  const total = periods.length
  const percentages: Record<string, number> = {}

  for (const mood in counts) {
    percentages[mood] = Math.round((counts[mood] / total) * 100 * 100) / 100
  }

  return percentages
}
