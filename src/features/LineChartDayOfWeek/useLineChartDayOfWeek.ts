import { useMemo } from 'react'

import { ThemeVariants, TimePeriod } from '../../types'
import { useTranslate } from '../../hooks/useTranslate'
import useTheme from '../../hooks/useTheme'

import { getChartDataDayOverTime } from './helpers'

export const useLineChartDayOfWeek = (dates: TimePeriod[]) => {
  const { interfaceLang } = useTranslate()
  const { theme } = useTheme()

  const isDark = theme === ThemeVariants.DARK

  const chartData = useMemo(() => {
    return getChartDataDayOverTime(dates)
  }, [dates])

  return {
    colorAxis: isDark ? 'white' : 'black',
    locale: interfaceLang.popup.statistics.graphs.dayWeekLine,
    chartData,
  }
}
