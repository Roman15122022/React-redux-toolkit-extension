import React from 'react'
import { LineChart } from '@mui/x-charts'

import { useLineChartMood } from './useLineChartMood'
import { LineChartMoodProps } from './types'

export const LineChartMood = ({ dates }: LineChartMoodProps): JSX.Element => {
  const { colorAxis, locale, chartData, seconds } = useLineChartMood(dates)

  return (
    <LineChart
      dataset={chartData}
      xAxis={[{ dataKey: 'mood', label: locale.labelMood, scaleType: 'band' }]}
      yAxis={[
        {
          dataKey: 'time',
          label: locale.labelTime,
          labelStyle: {
            transform: 'rotate(-90deg) translateX(-104px) translateY(-181px)',
            textAnchor: 'middle',
            fontSize: 14,
          },
        },
      ]}
      series={[
        {
          dataKey: 'time',
          label: locale.title,
          valueFormatter: value => `${value} ${seconds}`,
        },
      ]}
      width={415}
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
        '& .MuiChartsAxis-bottom .MuiChartsAxis-tick': {
          stroke: colorAxis,
        },
        '& .MuiChartsAxis-left .MuiChartsAxis-line': {
          stroke: colorAxis,
        },
        '& .MuiChartsAxis-left .MuiChartsAxis-tickLabel': {
          fill: colorAxis,
        },
        '& .MuiChartsAxis-left .MuiChartsAxis-tick': {
          stroke: colorAxis,
        },
      }}
    />
  )
}
