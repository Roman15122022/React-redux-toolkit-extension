import { TimePeriod } from '../../types'

import { DataActivity } from './types'
import { PIE_CHART_ACTIVITY_COLORS } from './constants'

export function getActivityValues(data: TimePeriod[]): DataActivity[] {
  const dictionary: Record<string, number> = data.reduce((acc, item) => {
    acc[item.activityName] = (acc[item.activityName] || 0) + 1

    return acc
  }, {})

  return Object.keys(dictionary).map((item, index) => {
    return {
      color:
        PIE_CHART_ACTIVITY_COLORS[index % PIE_CHART_ACTIVITY_COLORS.length],
      id: index,
      label: item,
      value: Math.round((dictionary[item] / data.length) * 100 * 100) / 100,
    }
  })
}
