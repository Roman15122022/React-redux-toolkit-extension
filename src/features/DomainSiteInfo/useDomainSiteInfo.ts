import { useLayoutEffect, useMemo, useState } from 'react'

import { ThemeVariants } from '../../types'
import { fullFormatTime } from '../../NavigationPages/TrackTimePage/helpers'
import { useTranslate } from '../../hooks/useTranslate'
import useTheme from '../../hooks/useTheme'
import { useManageBlackListDomain } from '../../hooks/useManageBlackListDomain'
import { useAppSelector } from '../../hooks/useAppSelector'
import { TIME_IN_MS } from '../../constants'

import { ChartData, DomainSiteInfoProps } from './types'
import { getReadableName } from './helpers'
import {
  DOMAIN_COLORS,
  DOMAIN_NAME_MAP,
  MAX_SIZE_LIST_UNTIL_OTHERS,
  OTHERS_COLORS,
} from './constants'

export const useDomainSiteInfo = ({
  setIsActivityFilterVisible,
  period,
}: DomainSiteInfoProps) => {
  const { interfaceLang } = useTranslate()
  const otherName = interfaceLang.popup.statistics.siteDomainStat.others

  const { theme } = useTheme()
  const isDarkTheme = theme === ThemeVariants.DARK

  const { sessions, blackList } = useAppSelector(
    state => state.SessionDataSlice,
  )

  const [isGraph, setGraph] = useState<boolean>(true)

  const { handleAddItemToBlackList, handleRemoveItemFromBlackList } =
    useManageBlackListDomain()

  const quickSetBlackList = new Set(blackList)

  const filteredByDataSessions = useMemo(() => {
    if (period == '0') return sessions

    const now = new Date()
    const periodInDays = parseInt(period)
    const cutoffDate = new Date(now)
    cutoffDate.setDate(now.getDate() - periodInDays)

    return sessions.filter(session => {
      const sessionDate = new Date(session.startTime)

      return sessionDate >= cutoffDate
    })
  }, [period, sessions])

  const allActualDomenDataText = useMemo(() => {
    const dictionaryData = filteredByDataSessions.reduce(
      (acc, { fullDomain, duration }) => {
        if (!acc[fullDomain]) {
          acc[fullDomain] = 0
        }

        acc[fullDomain] += duration

        return acc
      },
      {} as Record<string, number>,
    )

    return Object.keys(dictionaryData)
      .map(key => {
        return {
          label: key,
          value: Math.round(dictionaryData[key] / TIME_IN_MS.SECOND),
        }
      })
      .sort((a, b) => b.value - a.value)
      .map(item => {
        const formattedValue = fullFormatTime(
          item.value,
          interfaceLang,
        ).replaceAll('0', '')

        return { ...item, value: formattedValue }
      })
  }, [filteredByDataSessions])

  const actualDomenData = useMemo(() => {
    const dictionaryData = filteredByDataSessions.reduce(
      (acc, { fullDomain, duration }) => {
        const key = getReadableName(fullDomain)

        if (!acc[key]) {
          acc[key] = 0
        }

        acc[key] += duration

        return acc
      },
      {} as Record<string, number>,
    )

    return Object.keys(dictionaryData).map(key => {
      const lowerKey = key.toLowerCase()
      const color = DOMAIN_COLORS[lowerKey]

      const base: ChartData = {
        label: DOMAIN_NAME_MAP[lowerKey] || key,
        value: Math.round(dictionaryData[key] / TIME_IN_MS.SECOND),
      }

      if (color) {
        base.color = color
      }

      return base
    })
  }, [filteredByDataSessions])

  const filterToOtherData: ChartData[] = useMemo(() => {
    const sortedDataByTime = actualDomenData.sort((a, b) => b.value - a.value)

    const filteredData = sortedDataByTime.slice(0, MAX_SIZE_LIST_UNTIL_OTHERS)

    const othersArray = sortedDataByTime.slice(MAX_SIZE_LIST_UNTIL_OTHERS)

    if (othersArray.length === 0) {
      return filteredData
    }

    const othersData: ChartData = othersArray.reduce(
      (acc: ChartData, { value }) => {
        acc.value = acc.value + value

        return acc
      },
      { value: 0, label: otherName, color: OTHERS_COLORS },
    )

    return [...filteredData, othersData]
  }, [actualDomenData])

  const handleToggleGraphText = (): void => {
    setGraph(prevState => !prevState)
  }

  useLayoutEffect(() => {
    setIsActivityFilterVisible(false)

    return () => {
      setIsActivityFilterVisible(true)
    }
  }, [])

  const valueFormatter = (item: { value: number }) => {
    return fullFormatTime(item.value, interfaceLang).replaceAll('0', '')
  }

  const isInBlackList = (domain: string): boolean => {
    return quickSetBlackList.has(domain)
  }

  const handleToggleBlackList = (domain: string): void => {
    if (isInBlackList(domain)) {
      handleRemoveItemFromBlackList(domain)

      return
    }

    handleAddItemToBlackList(domain)
  }

  return {
    locale: interfaceLang.popup.statistics.siteDomainStat,
    filterToOtherData,
    allActualDomenDataText,
    colorText: isDarkTheme ? 'white' : 'black',
    valueFormatter,
    isGraph,
    handleToggleGraphText,
    handleToggleBlackList,
    isInBlackList,
  }
}
