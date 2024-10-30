import { useMemo } from 'react'

import { useTranslate } from '../../hooks/useTranslate'
import { useAppSelector } from '../../hooks/useAppSelector'

import { StatisticsFields } from './types'
import {
  getAveragePerDay,
  getAveragePerSession,
  getCountSessions,
  getCustomizeAllTime,
  getDaysBasedOnProduct,
  getMinMaxSessionTime,
} from './helpers'

export const useTextStatistics = () => {
  const { dates } = useAppSelector(state => state.TimerLogsReducer)

  const { interfaceLang } = useTranslate()

  const locale = interfaceLang.popup.statistics

  const allTime = useMemo(
    () => getCustomizeAllTime(dates, interfaceLang),
    [dates, interfaceLang],
  )

  const countSessions = useMemo(() => getCountSessions(dates), [dates])

  const averagePerDay = useMemo(
    () => getAveragePerDay(dates, interfaceLang),
    [interfaceLang, dates],
  )

  const averagePerSession = useMemo(
    () => getAveragePerSession(dates, countSessions, interfaceLang),
    [dates, interfaceLang],
  )

  const { minTimeSession, maxTimeSession } = useMemo(
    () => getMinMaxSessionTime(dates, interfaceLang),
    [dates, interfaceLang],
  )

  const { mostProductDay, mostUnProductDay } = useMemo(
    () => getDaysBasedOnProduct(dates, interfaceLang),
    [dates, interfaceLang],
  )

  const statisticsFields: StatisticsFields[] = [
    {
      name: locale.allTime,
      value: allTime,
    },
    {
      name: locale.totalSessions,
      value: countSessions,
    },
    {
      name: locale.averagePerDay,
      value: averagePerDay,
    },
    {
      name: locale.averageSessionTime,
      value: averagePerSession,
    },
    {
      name: locale.maxSessionTime,
      value: maxTimeSession,
    },
    {
      name: locale.minSessionTime,
      value: minTimeSession,
    },
    {
      name: locale.theMostProductDay,
      value: mostProductDay,
    },
    {
      name: locale.theMostUnProductDay,
      value: mostUnProductDay,
    },
    {
      name: locale.theMostProductivePeriodOfDay,
      value: '123',
    },
  ]

  return { statisticsFields }
}
