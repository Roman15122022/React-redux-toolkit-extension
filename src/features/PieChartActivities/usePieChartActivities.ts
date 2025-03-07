import { useLayoutEffect, useMemo } from 'react'

import { ThemeVariants, TimePeriod } from '../../types'
import useTheme from '../../hooks/useTheme'

import { getActivityValues } from './helpers'

export const usePieChartActivities = (
  dates: TimePeriod[],
  setIsActivityFilterVisible: (value: boolean) => void,
) => {
  const { theme } = useTheme()

  const isDarkTheme = theme === ThemeVariants.DARK

  const valueActivity = useMemo(() => getActivityValues(dates), [dates])

  useLayoutEffect(() => {
    setIsActivityFilterVisible(false)

    return () => {
      setIsActivityFilterVisible(true)
    }
  }, [])

  return {
    colorText: isDarkTheme ? 'white' : 'black',
    valueActivity,
  }
}
