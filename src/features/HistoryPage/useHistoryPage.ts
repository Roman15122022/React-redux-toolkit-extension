import { useState } from 'react'

import { useTranslate } from '../../hooks/useTranslate'
import { useAppSelector } from '../../hooks/useAppSelector'

import { HistoryDate } from './types'
import { getNormalizeName, getUniqStudyDays } from './helpers'

export const useHistoryPage = () => {
  const { dates } = useAppSelector(state => state.TimerLogsReducer)

  const { interfaceLang, language } = useTranslate()

  const [selectedDate, setSelectedDate] = useState<number>(0)

  function handleSelectDate(date: string): void {
    const fullDate = new Date(date).getTime()

    setSelectedDate(fullDate)
  }

  function isSelectedDate(date: string): boolean {
    return selectedDate === new Date(date).getTime()
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
    selectedDate,
  }
}
