import { useTranslate } from '../../hooks/useTranslate'
import { useAppSelector } from '../../hooks/useAppSelector'
import {
  getTotalTimeForActivityName,
  getUniqNamesActivity,
} from '../../helpers'
import { TIME_IN_SECONDS } from '../../constants'

import { Achievements } from './types'
import { getCustomizedTime, getPercentByTime } from './helpers'
import { SPECIALIST } from './constants'

export const useAchievements = () => {
  const { dates } = useAppSelector(state => state.TimerLogsReducer)

  const { interfaceLang } = useTranslate()

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
    .sort((a, b) => b.totalTimeInSeconds - a.totalTimeInSeconds)

  return {
    locale: interfaceLang.popup.achievements,
    achievements,
  }
}
