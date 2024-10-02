import { useTranslate } from '../../hooks/useTranslate'
import { useAppSelector } from '../../hooks/useAppSelector'
import { getDataForDefiniteDay } from '../../helpers'

import { Periods } from './types'
import { customizedPeriod, totalElapsedTime } from './helpers'

export const useStudyTimeInfoForDay = (currentDate: number) => {
  const { interfaceLang, language } = useTranslate()

  const { dates } = useAppSelector(state => state.TimerLogsReducer)

  function getPeriods(): Array<Periods> {
    const todayData = getDataForDefiniteDay(currentDate, dates)

    return todayData.map(item => {
      return {
        period: customizedPeriod(item, language),
        activityName: item.activityName,
      }
    })
  }

  return {
    locale: interfaceLang.popup.track,
    periods: getPeriods(),
    totalForDay: totalElapsedTime(dates, interfaceLang, currentDate),
  }
}
