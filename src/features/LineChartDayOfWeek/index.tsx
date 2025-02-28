import React from 'react'
import { LineChart } from '@mui/x-charts'

import { useLineChartDayOfWeek } from './useLineChartDayOfWeek'
import { LineChartDayOfWeekProps } from './types'

export const LineChartDayOfWeek = ({ dates }: LineChartDayOfWeekProps) => {
  const { locale, chartData, colorAxis } = useLineChartDayOfWeek(dates)

  return (
    <LineChart
      dataset={chartData}
      xAxis={[{ dataKey: 'day', label: locale.labelMood }]}
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
