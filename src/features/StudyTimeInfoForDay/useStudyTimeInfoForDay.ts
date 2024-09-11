import { useTranslate } from '../../hooks/useTranslate'
import { useAppSelector } from '../../hooks/useAppSelector'
import { getDataForDefiniteDay } from '../../helpers'

import { customizedPeriod, totalElapsedTime } from './helpers'

export const useStudyTimeInfoForDay = () => {
  const { interfaceLang, language } = useTranslate()

  const { dates } = useAppSelector(state => state.TimerLogsReducer)

  function getPeriods(): Array<string> {
    const now = Date.now()

    const todayData = getDataForDefiniteDay(now, dates)

    return todayData.map(item => customizedPeriod(item, language))
  }

  return {
    locale: interfaceLang.popup.track,
    periods: getPeriods(),
    totalForDay: totalElapsedTime(dates, interfaceLang),
  }
}
