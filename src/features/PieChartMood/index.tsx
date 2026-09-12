import React from 'react'
import { PieChart } from '@mui/x-charts/PieChart'

import PieChartLegend from '../../components/PieChartLegend'

import { usePieChartMood } from './usePieChartMood'
import { PieChartMoodProps } from './types'

export const PieChartMood = ({ dates }: PieChartMoodProps): JSX.Element => {
  const { colorNeutral, locale, valueMoods } = usePieChartMood(dates)

  const moodData = [
    {
      id: 1,
      value: valueMoods[1 || 0],
      label: locale.veryDissatisfied,
      color: '#d32f2f',
    },
    {
      id: 2,
      value: valueMoods[2 || 0],
      label: locale.dissatisfied,
      color: '#ed6c02',
    },
    {
      id: 3,
      value: valueMoods[3] || 0,
      label: locale.neutral,
      color: colorNeutral,
    },
    {
      id: 4,
      value: valueMoods[4] || 0,
      label: locale.satisfied,
      color: '#0288d1',
    },
    {
      id: 5,
      value: valueMoods[5] || 0,
      label: locale.verySatisfied,
      color: '#2e7d32',
    },
  ]

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <PieChart
        series={[
          {
            data: moodData,
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
      <PieChartLegend items={moodData} />
    </div>
  )
}
