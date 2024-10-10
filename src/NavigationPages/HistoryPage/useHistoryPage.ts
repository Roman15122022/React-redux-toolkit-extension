import { useState } from 'react'

import { fillArr } from '../../utils'
import { useTranslate } from '../../hooks/useTranslate'
import { useStateSaver } from '../../hooks/useStateSaver'
import { useAppSelector } from '../../hooks/useAppSelector'
import { formatLanguageDate, getSegment } from '../../helpers'
import { DATE_FULL_MONTH } from '../../constants'

import { HistoryDate } from './types'
import { getNormalizeName, getUniqStudyDays } from './helpers'
import { LIMIT_BUTTON_PAGE } from './constants'

export const useHistoryPage = () => {
  const { dates } = useAppSelector(state => state.TimerLogsReducer)

  const { interfaceLang, language } = useTranslate()
  const { historyPage, setHistoryState } = useStateSaver()

  const [selectedDate, setSelectedDate] = useState<number>(
    historyPage.selectedDate,
  )
  const [currentPage, setCurrentPage] = useState<number>(
    historyPage.selectedPage,
  )

  function handleSetCurrentPage(selectedPage: number): void {
    setCurrentPage(selectedPage)
    setHistoryState({ ...historyPage, selectedPage })
  }

  function isSelectedDate(date: number): boolean {
    return selectedDate === new Date(date).getTime()
  }

  function handleSelectDate(date: number): void {
    const fullDate = new Date(date).getTime()

    if (fullDate === selectedDate) {
      setSelectedDate(0)
      setHistoryState({ ...historyPage, selectedDate: 0 })

      return
    }

    setSelectedDate(fullDate)
    setHistoryState({ ...historyPage, selectedDate: fullDate })
  }

  const historyDates: HistoryDate[] = getUniqStudyDays(dates, language)
    .reverse()
    .map(({ localizeName, date }) => {
      return {
        name: getNormalizeName(localizeName),
        onClick: () => handleSelectDate(date),
        isSelected: isSelectedDate(date),
      }
    })

  function handleGetPages(): Array<number> {
    const pages = Math.ceil(historyDates.length / LIMIT_BUTTON_PAGE)

    return fillArr(pages)
  }

  function getFullMonthSelectedDate() {
    return formatLanguageDate(selectedDate, DATE_FULL_MONTH, language)
      .split(',')
      .at(0)
  }

  return {
    interfaceLang,
    historyDates: getSegment(historyDates, LIMIT_BUTTON_PAGE, currentPage),
    selectedDate,
    pages: handleGetPages(),
    currentPage,
    handleSetCurrentPage,
    fullMonthName: getFullMonthSelectedDate(),
  }
}
