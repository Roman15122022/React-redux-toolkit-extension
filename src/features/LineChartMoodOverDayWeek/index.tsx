import React from 'react'
import { LineChart } from '@mui/x-charts'

import { useLineChartMoodOverDayWeek } from './useLineChartMoodOverDayWeek'
import { LineChartMoodDayProps } from './types'

export const LineChartMoodOverDayWeek = ({
  dates,
}: LineChartMoodDayProps): JSX.Element => {
  const { colorAxis, locale, chartData } = useLineChartMoodOverDayWeek(dates)

  return (
    <LineChart
      dataset={chartData}
      xAxis={[
        {
          dataKey: 'day',
          label: locale.labelDay,
          scaleType: 'band',
        },
      ]}
      yAxis={[
        {
          dataKey: 'mood',
          label: locale.labelMood,
          scaleType: 'linear',
          min: 1,
          max: 5,
          tickMinStep: 1,
          labelStyle: {
            transform: 'rotate(-90deg) translateX(-104px) translateY(-181px)',
            textAnchor: 'middle',
            fontSize: 14,
          },
        },
      ]}
      series={[{ dataKey: 'mood', label: locale.title }]}
      width={410}
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
