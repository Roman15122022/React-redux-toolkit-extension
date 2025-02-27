import resolveConfig from 'tailwindcss/resolveConfig'
import { useMemo } from 'react'

import { ThemeVariants, TimePeriod } from '../../types'
import { useTranslate } from '../../hooks/useTranslate'
import useTheme from '../../hooks/useTheme'
import tailwindConfig from '../../../tailwind.config.js'

import { getValueForMoods } from './helpers'

export const usePieChartMood = (dates: TimePeriod[]) => {
  const { interfaceLang } = useTranslate()
  const { theme } = useTheme()

  const isDarkTheme = theme === ThemeVariants.DARK

  const fullConfig = resolveConfig(tailwindConfig)

  const valueMoods = useMemo(() => getValueForMoods(dates), [dates])

  return {
    colorText: isDarkTheme ? 'white' : 'black',
    colorNeutral: fullConfig.theme.colors.purple.light,
    locale: interfaceLang.popup.statistics.moods,
    valueMoods,
  }
}
