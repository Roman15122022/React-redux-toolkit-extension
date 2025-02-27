import React from 'react'
import { PieChart } from '@mui/x-charts/PieChart'

import { usePieChartMood } from './usePieChartMood'
import { PieChartMoodProps } from './types'

export const PieChartMood = ({ dates }: PieChartMoodProps): JSX.Element => {
  const { colorText, colorNeutral, locale } = usePieChartMood(dates)

  return (
    <PieChart
      className="pr-3"
      series={[
        {
          data: [
            {
              id: 1,
              value: 10,
              label: locale.veryDissatisfied,
              color: '#d32f2f',
            },
            { id: 2, value: 15, label: locale.dissatisfied, color: '#ed6c02' },
            { id: 3, value: 20, label: locale.neutral, color: colorNeutral },
            { id: 4, value: 20, label: locale.satisfied, color: '#0288d1' },
            { id: 5, value: 20, label: locale.verySatisfied, color: '#2e7d32' },
          ],
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
