import React from 'react'

import { usePieChartActivities } from './usePieChartActivities'
import { PieChartActivitiesProps } from './types'

export const PieChartActivities = ({
  dates,
  setIsActivityFilterVisible,
}: PieChartActivitiesProps): JSX.Element => {
  const { colorText, colorNeutral, valueActivity } = usePieChartActivities(
    dates,
    setIsActivityFilterVisible,
  )

  return <div>1</div>
}
