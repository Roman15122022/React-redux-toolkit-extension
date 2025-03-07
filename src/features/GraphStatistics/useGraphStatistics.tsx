import React, { useState } from 'react'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import PieChartIcon from '@mui/icons-material/PieChart'

import { PieChartMood } from '../PieChartMood'
import { PieChartActivities } from '../PieChartActivities'
import { LineChartMoodOverDayWeek } from '../LineChartMoodOverDayWeek'
import { LineChartMood } from '../LineChartMood'
import { LineChartDayOfWeek } from '../LineChartDayOfWeek'
import { TimePeriod } from '../../types'
import { useTranslate } from '../../hooks/useTranslate'

import { ChartType } from './enums'

export const useGraphStatistics = (
  dates: TimePeriod[],
  dataFilteredOnlyByTimePeriod: TimePeriod[],
  setIsActivityFilterVisible: (visible: boolean) => void,
) => {
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
    {
      id: 2,
      icon: <PieChartIcon />,
      title: locale.graphsTitles.activityPie,
      onClick: () => setChartType(ChartType.ACTIVITY_PIE),
      isActive: chartType === ChartType.ACTIVITY_PIE,
    },
    {
      id: 3,
      icon: <ShowChartIcon />,
      title: locale.graphsTitles.moodLine,
      onClick: () => setChartType(ChartType.MOOD_LINE),
      isActive: chartType === ChartType.MOOD_LINE,
    },
    {
      id: 4,
      icon: <ShowChartIcon />,
      title: locale.graphsTitles.dayWeekLine,
      onClick: () => setChartType(ChartType.DAY_WEEK_LINE),
      isActive: chartType === ChartType.DAY_WEEK_LINE,
    },
    {
      id: 5,
      icon: <ShowChartIcon />,
      title: locale.graphsTitles.moodOverDay,
      onClick: () => setChartType(ChartType.MOOD_OVER_DAY),
      isActive: chartType === ChartType.MOOD_OVER_DAY,
    },
  ]

  const graphsDictionary = {
    [ChartType.MOOD_PIE]: <PieChartMood dates={dates} />,
    [ChartType.ACTIVITY_PIE]: (
      <PieChartActivities
        dates={dataFilteredOnlyByTimePeriod}
        setIsActivityFilterVisible={setIsActivityFilterVisible}
      />
    ),
    [ChartType.MOOD_LINE]: <LineChartMood dates={dates} />,
    [ChartType.DAY_WEEK_LINE]: <LineChartDayOfWeek dates={dates} />,
    [ChartType.MOOD_OVER_DAY]: <LineChartMoodOverDayWeek dates={dates} />,
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
