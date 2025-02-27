import React from 'react'
import { LineChart } from '@mui/x-charts'

import { useLineChartMood } from './useLineChartMood'
import { LineChartMoodProps } from './types'

export const LineChartMood = ({ dates }: LineChartMoodProps): JSX.Element => {
  const { colorAxis, locale, chartData } = useLineChartMood(dates)

  return (
    <LineChart
      dataset={chartData}
      xAxis={[{ dataKey: 'mood', label: locale.labelMood }]}
      yAxis={[{ dataKey: 'time', label: locale.labelTime }]}
      series={[{ dataKey: 'time', label: locale.title }]}
      width={400}
      height={280}
      slotProps={{
        axisLabel: {
          fill: colorAxis,
          fontSize: 11,
        },
        legend: {
          labelStyle: {
            fill: colorAxis,
            fontSize: 11,
          },
        },
      }}
      sx={{
        '& .MuiChartsAxis-bottom .MuiChartsAxis-line': {
          stroke: colorAxis,
        },
        '& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel': {
          fill: colorAxis,
        },
        '& .MuiChartsAxis-left .MuiChartsAxis-line': {
          stroke: colorAxis,
        },
        '& .MuiChartsAxis-left .MuiChartsAxis-tickLabel': {
          fill: colorAxis,
        },
      }}
    />
  )
}
