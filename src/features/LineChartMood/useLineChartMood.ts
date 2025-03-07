import { useMemo } from 'react'

import { ThemeVariants, TimePeriod } from '../../types'
import { useTranslate } from '../../hooks/useTranslate'
import useTheme from '../../hooks/useTheme'

import { getChartData } from './helpers'

export const useLineChartMood = (dates: TimePeriod[]) => {
  const { interfaceLang } = useTranslate()
  const { theme } = useTheme()

  const isDark = theme === ThemeVariants.DARK

  const chartData = useMemo(
    () => getChartData(dates, interfaceLang.popup),
    [dates],
  )

  return {
    colorAxis: isDark ? 'white' : 'black',
    locale: interfaceLang.popup.statistics.graphs.moodsLine,
    chartData,
    seconds: interfaceLang.popup.statistics.graphs.sec,
  }
}
