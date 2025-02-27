import React, { useState } from 'react'
import PieChartIcon from '@mui/icons-material/PieChart'

import { PieChartMood } from '../PieChartMood'
import { TimePeriod } from '../../types'
import { useTranslate } from '../../hooks/useTranslate'

import { ChartType } from './enums'

export const useGraphStatistics = (dates: TimePeriod[]) => {
  const { interfaceLang } = useTranslate()

  const locale = interfaceLang.popup.statistics.graphs

  const [open, setOpen] = useState(false)
  const [chartType, setChartType] = useState<ChartType>(ChartType.MOOD_PIE)

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }

  const chartTypes = [
    {
      id: 1,
      icon: <PieChartIcon />,
      title: locale.graphsTitles.moodPie,
      onClick: () => setChartType(ChartType.MOOD_PIE),
      isActive: chartType === ChartType.MOOD_PIE,
    },
  ]

  const graphsDictionary = {
    [ChartType.MOOD_PIE]: <PieChartMood dates={dates} />,
  }

  return {
    locale,
    open,
    toggleDrawer,
    chartTypes,
    currentGraph: graphsDictionary[chartType] || null,
    currentTitle: chartTypes.find(item => item.isActive).title,
  }
}
