import { useMemo } from 'react'

import { ThemeVariants, TimePeriod } from '../../types'
import { useTranslate } from '../../hooks/useTranslate'
import useTheme from '../../hooks/useTheme'

import { getChartDataMoodOverDayWeek } from './helpers'

export const useLineChartMoodOverDayWeek = (dates: TimePeriod[]) => {
  const { interfaceLang } = useTranslate()
  const { theme } = useTheme()

  const isDark = theme === ThemeVariants.DARK

  const chartData = useMemo(
    () => getChartDataMoodOverDayWeek(dates, interfaceLang.popup),
    [dates],
  )

  return {
    colorAxis: isDark ? 'white' : 'black',
    locale: interfaceLang.popup.statistics.graphs.moodOverDay,
    chartData,
  }
}
