import { useState } from 'react'

import { fillArr } from '../../utils'
import { useTranslate } from '../../hooks/useTranslate'
import { useAppSelector } from '../../hooks/useAppSelector'

import { HistoryDate } from './types'
import { getSegment } from './helpers'
import { getNormalizeName, getUniqStudyDays } from './helpers'
import { LIMIT_BUTTON_PAGE } from './constants'

export const useHistoryPage = () => {
  const { dates } = useAppSelector(state => state.TimerLogsReducer)

  const { interfaceLang, language } = useTranslate()

  const [selectedDate, setSelectedDate] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)

  function handleSelectDate(date: number): void {
    const fullDate = new Date(date).getTime()

    setSelectedDate(fullDate)
  }

  function isSelectedDate(date: number): boolean {
    return selectedDate === new Date(date).getTime()
  }

  const historyDates: HistoryDate[] = getUniqStudyDays(dates, language).map(
    ({ localizeName, date }) => {
      return {
        name: getNormalizeName(localizeName),
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
    historyDates: getSegment(historyDates, LIMIT_BUTTON_PAGE, currentPage),
    selectedDate,
    pages: handleGetPages(),
    currentPage,
    setCurrentPage,
  }
}
