import { useState } from 'react'
import moment from 'moment'

import { useTranslate } from '../../hooks/useTranslate'
import { useAppSelector } from '../../hooks/useAppSelector'

import { getUniqStudyDays } from './helpers'

export const useHistoryPage = () => {
  const { dates } = useAppSelector(state => state.TimerLogsReducer)

  const { interfaceLang, language } = useTranslate()

  const [selectedDate, setSelectedDate] = useState<string>('')

  const arrayUniqDates = getUniqStudyDays(dates, language)

  return { interfaceLang, arrayUniqDates }
}
