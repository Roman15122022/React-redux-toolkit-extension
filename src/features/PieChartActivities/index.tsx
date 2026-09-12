import React from 'react'
import { PieChart } from '@mui/x-charts/PieChart'

import PieChartLegend from '../../components/PieChartLegend'

import { usePieChartActivities } from './usePieChartActivities'
import { PieChartActivitiesProps } from './types'

export const PieChartActivities = ({
  dates,
  setIsActivityFilterVisible,
}: PieChartActivitiesProps): JSX.Element => {
  const { valueActivity } = usePieChartActivities(
    dates,
    setIsActivityFilterVisible,
  )

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <PieChart
        series={[
          {
            data: valueActivity,
            valueFormatter: value => `${(value as any).data} %`,
          },
        ]}
        width={320}
        height={190}
        slotProps={{
          legend: {
            hidden: true,
          },
        }}
      />
      <PieChartLegend items={valueActivity} />
    </div>
  )
}
