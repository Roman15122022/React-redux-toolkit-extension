import { useState } from 'react'

import { fillArr } from '../../utils'
import { useTranslate } from '../../hooks/useTranslate'
import { useStateSaver } from '../../hooks/useStateSaver'
import { useAppSelector } from '../../hooks/useAppSelector'
import { getSegment } from '../../helpers'

import { HistoryDate, HistoryView } from './types'
import {
  getFullMonthSelectedDate,
  getNormalizeName,
  getUniqStudyDays,
} from './helpers'
import { LIMIT_BUTTON_PAGE } from './constants'

function getStartOfDayTimestamp(date: number): number {
  return new Date(date).setHours(0, 0, 0, 0)
}

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
  const [historyView, setHistoryView] = useState<HistoryView>(
    historyPage.historyView || 'list',
  )

  function handleSetCurrentPage(selectedPage: number): void {
    setCurrentPage(selectedPage)
    setHistoryState({ ...historyPage, historyView, selectedPage })
  }

  function handleChangeHistoryView(view: HistoryView): void {
    const nextSelectedDate =
      view === 'calendar' && !selectedDate
        ? getStartOfDayTimestamp(Date.now())
        : selectedDate

    setHistoryView(view)
    setSelectedDate(nextSelectedDate)
    setHistoryState({
      ...historyPage,
      selectedDate: nextSelectedDate,
      selectedPage: currentPage,
      historyView: view,
    })
  }

  function isSelectedDate(date: number): boolean {
    return (
      Boolean(selectedDate) &&
      getStartOfDayTimestamp(selectedDate) === getStartOfDayTimestamp(date)
    )
  }

  function handleSelectDate(date: number): void {
    const fullDate = getStartOfDayTimestamp(date)

    if (isSelectedDate(fullDate)) {
      setSelectedDate(0)
      setHistoryState({ ...historyPage, historyView, selectedDate: 0 })

      return
    }

    setSelectedDate(fullDate)
    setHistoryState({ ...historyPage, historyView, selectedDate: fullDate })
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

  return {
    dates,
    interfaceLang,
    historyView,
    historyDates: getSegment(historyDates, LIMIT_BUTTON_PAGE, currentPage),
    selectedDate,
    pages: handleGetPages(),
    currentPage,
    handleSetCurrentPage,
    handleChangeHistoryView,
    handleSelectDate,
    fullMonthName: getFullMonthSelectedDate(selectedDate, language),
  }
}
