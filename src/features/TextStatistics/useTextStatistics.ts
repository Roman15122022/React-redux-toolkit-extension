import { useMemo } from 'react'

import { useTranslate } from '../../hooks/useTranslate'
import { useAppSelector } from '../../hooks/useAppSelector'

import { StatisticsFields } from './types'
import {
  findMostProductiveThreeHourPeriod,
  getAveragePerDay,
  getAveragePerSession,
  getCountSessions,
  getCustomizeAllTime,
  getDaysBasedOnProduct,
  getMinMaxSessionTime,
} from './helpers'

export const useTextStatistics = () => {
  const { dates } = useAppSelector(state => state.TimerLogsReducer)

  const { interfaceLang, language } = useTranslate()

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

  const mostProductivePeriod = useMemo(
    () => findMostProductiveThreeHourPeriod(dates, language),
    [dates],
  )

  const statisticsFields: StatisticsFields[] = [
    {
      name: locale.allTime,
      value: allTime,
      description: locale.descriptionAllTime,
    },
    {
      name: locale.totalSessions,
      value: countSessions,
      description: locale.descriptionTotalSessions,
    },
    {
      name: locale.averagePerDay,
      value: averagePerDay,
      description: locale.descriptionAveragePerDay,
    },
    {
      name: locale.averageSessionTime,
      value: averagePerSession,
      description: locale.descriptionAverageSessionTime,
    },
    {
      name: locale.maxSessionTime,
      value: maxTimeSession,
      description: locale.descriptionMaxSessionTime,
    },
    {
      name: locale.minSessionTime,
      value: minTimeSession,
      description: locale.descriptionMinSessionTime,
    },
    {
      name: locale.theMostProductDay,
      value: `${mostProductDay}`,
      description: locale.descriptionTheMostProductDay,
    },
    {
      name: locale.theMostUnProductDay,
      value: `${mostUnProductDay}`,
      description: locale.descriptionTheMostUnProductDay,
    },
    {
      name: locale.theMostProductivePeriodOfDay,
      value: mostProductivePeriod,
      description: locale.descriptionTheMostProductivePeriodOfDay,
    },
  ]

  return { statisticsFields }
}
