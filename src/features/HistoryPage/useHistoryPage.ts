import { useState } from 'react'
import moment from 'moment'

import { useTranslate } from '../../hooks/useTranslate'
import { useAppSelector } from '../../hooks/useAppSelector'
import { DATE_FULL_FORMAT } from '../../constants'

import { HistoryDate } from './types'
import { getNormalizeName, getUniqStudyDays } from './helpers'

export const useHistoryPage = () => {
  const { dates } = useAppSelector(state => state.TimerLogsReducer)

  const { interfaceLang, language } = useTranslate()

  const [selectedDate, setSelectedDate] = useState<number>(0)

  function handleSelectDate(date: string): void {
    const fullDate = moment(date, DATE_FULL_FORMAT).valueOf()

    setSelectedDate(fullDate)
  }

  function isSelectedDate(date: string): boolean {
    return selectedDate === moment(date, DATE_FULL_FORMAT).valueOf()
  }

  const historyDates: HistoryDate[] = getUniqStudyDays(dates, language).map(
    date => {
      return {
        name: getNormalizeName(date),
        onClick: () => handleSelectDate(date),
        isSelected: isSelectedDate(date),
      }
    },
  )

  return {
    interfaceLang,
    historyDates,
  }
}
