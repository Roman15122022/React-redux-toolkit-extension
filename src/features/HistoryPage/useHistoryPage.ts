import { useState } from 'react'

import { fillArr } from '../../utils'
import { useTranslate } from '../../hooks/useTranslate'
import { useAppSelector } from '../../hooks/useAppSelector'

import { HistoryDate } from './types'
import { getNormalizeName, getUniqStudyDays } from './helpers'
import { LIMIT_BUTTON_PAGE } from './constants'

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

  function handleGetPages(): Array<number> {
    const pages = Math.ceil(historyDates.length / LIMIT_BUTTON_PAGE)

    return fillArr(pages)
  }

  return {
    interfaceLang,
    historyDates,
    selectedDate,
    pages: handleGetPages(),
  }
}
