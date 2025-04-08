import { useLayoutEffect, useMemo } from 'react'

import { ThemeVariants } from '../../types'
import { fullFormatTime } from '../../NavigationPages/TrackTimePage/helpers'
import { useTranslate } from '../../hooks/useTranslate'
import useTheme from '../../hooks/useTheme'
import { useAppSelector } from '../../hooks/useAppSelector'
import { TIME_IN_MS } from '../../constants'

import { ChartData, DomainSiteInfoProps } from './types'
import { getReadableName } from './helpers'

export const useDomainSiteInfo = ({
  setIsActivityFilterVisible,
  period,
}: DomainSiteInfoProps) => {
  const { interfaceLang } = useTranslate()

  const { theme } = useTheme()

  const isDarkTheme = theme === ThemeVariants.DARK

  const { sessions } = useAppSelector(state => state.SessionDataSlice)

  const filteredByDataSessions = useMemo(() => {
    if (period === '0') return sessions

    const now = new Date()
    const periodInDays = parseInt(period)
    const cutoffDate = new Date(now)
    cutoffDate.setDate(now.getDate() - periodInDays)

    return sessions.filter(session => {
      const sessionDate = new Date(session.startTime)

      return sessionDate >= cutoffDate
    })
  }, [period, sessions])

  const actualDomenData: ChartData[] = useMemo(() => {
    const dictionaryData = filteredByDataSessions.reduce(
      (acc, { domain, duration }) => {
        const key = getReadableName(domain)

        if (!acc[key]) {
          acc[key] = 0
        }

        acc[key] += duration

        return acc
      },
      {} as Record<string, number>,
    )

    return Object.keys(dictionaryData).map(key => {
      return {
        label: key,
        value: Math.round(dictionaryData[key] / TIME_IN_MS.SECOND),
      }
    })
  }, [filteredByDataSessions])

  useLayoutEffect(() => {
    setIsActivityFilterVisible(false)

    return () => {
      setIsActivityFilterVisible(true)
    }
  }, [])

  const valueFormatter = (item: { value: number }) =>
    fullFormatTime(item.value, interfaceLang)

  return {
    locale: interfaceLang.popup.statistics.siteDomainStat,
    actualDomenData,
    colorText: isDarkTheme ? 'white' : 'black',
    valueFormatter,
  }
}
