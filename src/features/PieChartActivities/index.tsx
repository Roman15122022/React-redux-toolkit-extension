import React from 'react'
import { PieChart } from '@mui/x-charts/PieChart'

import { usePieChartActivities } from './usePieChartActivities'
import { PieChartActivitiesProps } from './types'

export const PieChartActivities = ({
  dates,
  setIsActivityFilterVisible,
}: PieChartActivitiesProps): JSX.Element => {
  const { colorText, valueActivity } = usePieChartActivities(
    dates,
    setIsActivityFilterVisible,
  )

  return (
    <PieChart
      className="pr-3"
      series={[
        {
          data: valueActivity,
          valueFormatter: value => `${(value as any).data} %`,
        },
      ]}
      width={400}
      height={220}
      slotProps={{
        legend: {
          labelStyle: {
            fill: colorText,
            fontSize: 11,
          },
        },
      }}
    />
  )
}
