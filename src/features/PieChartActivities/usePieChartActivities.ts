import resolveConfig from 'tailwindcss/resolveConfig'
import { useLayoutEffect, useMemo } from 'react'

import { ThemeVariants, TimePeriod } from '../../types'
import useTheme from '../../hooks/useTheme'
import tailwindConfig from '../../../tailwind.config'

import { getActivityValues } from './helpers'

export const usePieChartActivities = (
  dates: TimePeriod[],
  setIsActivityFilterVisible: (value: boolean) => void,
) => {
  const { theme } = useTheme()

  const isDarkTheme = theme === ThemeVariants.DARK

  const fullConfig = resolveConfig(tailwindConfig)

  const valueActivity = useMemo(() => getActivityValues(dates), [dates])

  useLayoutEffect(() => {
    setIsActivityFilterVisible(false)

    return () => {
      setIsActivityFilterVisible(true)
    }
  }, [])

  return {
    colorText: isDarkTheme ? 'white' : 'black',
    colorNeutral: fullConfig.theme.colors.purple.light,
    valueActivity,
  }
}
