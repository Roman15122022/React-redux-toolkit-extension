import { useMemo } from 'react'

import { useTranslate } from '../../hooks/useTranslate'
import { useAppSelector } from '../../hooks/useAppSelector'

import { StatisticsFields } from './types'
import {
  getAveragePerDay,
  getAveragePerSession,
  getCountSessions,
  getCustomizeAllTime,
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
      value: '123',
    },
    {
      name: locale.minSessionTime,
      value: '123',
    },
    {
      name: locale.theMostProductDay,
      value: '123',
    },
    {
      name: locale.theMostUnProductDay,
      value: '123',
    },
    {
      name: locale.theMostProductivePeriodOfDay,
      value: '123',
    },
  ]

  return { statisticsFields }
}
