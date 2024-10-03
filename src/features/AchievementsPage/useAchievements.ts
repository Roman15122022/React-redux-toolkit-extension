import { useState } from 'react'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha'
import SortIcon from '@mui/icons-material/Sort'

import { useTranslate } from '../../hooks/useTranslate'
import { useAppSelector } from '../../hooks/useAppSelector'
import {
  getTotalTimeForActivityName,
  getUniqNamesActivity,
} from '../../helpers'
import { TIME_IN_SECONDS } from '../../constants'

import { Achievements, KindOfSorts, Sort } from './types'
import { getCustomizedTime, getPercentByTime } from './helpers'
import { SPECIALIST } from './constants'

export const useAchievements = () => {
  const { dates } = useAppSelector(state => state.TimerLogsReducer)

  const { interfaceLang } = useTranslate()

  const [sort, setSort] = useState<Sort>(Sort.TIME)

  const kindOfSort: KindOfSorts = {
    [Sort.TIME]: {
      icon: SortIcon,
      onClick: () => setSort(Sort.REVERSE_TIME),
    },
    [Sort.REVERSE_TIME]: {
      icon: SwapVertIcon,
      onClick: () => setSort(Sort.ALPHABET),
    },
    [Sort.ALPHABET]: {
      icon: SortByAlphaIcon,
      onClick: () => setSort(Sort.TIME),
    },
  }

  function handleSort(): (a: Achievements, b: Achievements) => number {
    switch (sort) {
      case Sort.TIME:
        return (a, b) => b.totalTimeInSeconds - a.totalTimeInSeconds

      case Sort.REVERSE_TIME:
        return (a, b) => a.totalTimeInSeconds - b.totalTimeInSeconds

      case Sort.ALPHABET:
        return (a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())

      default:
        return () => 0
    }
  }

  const achievements: Achievements[] = getUniqNamesActivity(dates)
    .map(item => {
      const totalTimeInSeconds = getTotalTimeForActivityName(item, dates)
      const isSpec = totalTimeInSeconds > SPECIALIST * TIME_IN_SECONDS.HOUR

      return {
        name: item,
        totalTime: getCustomizedTime(totalTimeInSeconds, interfaceLang),
        percents: getPercentByTime(totalTimeInSeconds, isSpec),
        isSpec,
        totalTimeInSeconds,
      }
    })
    .sort(handleSort())

  return {
    locale: interfaceLang.popup.achievements,
    achievements,
    iconSort: kindOfSort[sort],
  }
}
