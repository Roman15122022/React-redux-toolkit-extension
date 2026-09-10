import React from 'react'
import { Tooltip } from '@mui/material'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

import { cn } from '../../utils'
import { TypeButton, TypeTittle } from '../../types'
import StudyTimeInfoForDay from '../../features/StudyTimeInfoForDay'
import PaginationHistoryPages from '../../features/PaginationHistoryPages'
import CalendarHeatmap from '../../features/CalendarHeatmap'
import Title from '../../components/Title'
import Container from '../../components/Container'
import Button from '../../components/Button'

import { useHistoryPage } from './useHistoryPage'

const HistoryPage = (): JSX.Element => {
  const {
    dates,
    interfaceLang,
    historyView,
    historyDates,
    selectedDate,
    pages,
    currentPage,
    fullMonthName,
    handleSetCurrentPage,
    handleSelectDate,
    handleChangeHistoryView,
  } = useHistoryPage()
  const heatmapLocale = interfaceLang.popup.statistics.heatmap

  function openOptionsHeatmap(): void {
    chrome.tabs.create({
      url: 'options.html?history=true&period=12',
    })
  }

  if (!dates.length) {
    return (
      <Title
        variant={TypeTittle.SMALL}
        classes="mt-5 text-center"
        title={interfaceLang.popup.history.noHistory}
      />
    )
  }

  return (
    <Container classes="mr-0 mt-4">
      <div className="mb-3 flex w-[95%] items-start justify-between gap-3">
        {historyView === 'calendar' ? (
          <div className="min-w-0">
            <p className="theme-text text-lg font-bold leading-tight">
              {heatmapLocale.title}
            </p>
            <p className="mt-1 text-[12px] leading-snug text-gray-600 dark:text-gray-300">
              {heatmapLocale.description}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold">
              <span className="rounded-md bg-gray-100 px-2 py-1 text-gray-700 dark:bg-[#212830] dark:text-gray-200">
                {heatmapLocale.lastMonths.replace('{count}', '6')}
              </span>
              <button
                type="button"
                onClick={openOptionsHeatmap}
                className="theme-text rounded-md border border-gray-300 px-2 py-1 hover:border-secondary-light hover:text-secondary-light dark:border-purple-light dark:hover:text-purple-light"
              >
                {heatmapLocale.moreDetails}
              </button>
            </div>
          </div>
        ) : (
          <span />
        )}

        <div className="flex">
          <Tooltip title={interfaceLang.popup.history.listView}>
            <button
              type="button"
              onClick={() => handleChangeHistoryView('list')}
              className={cn(
                'theme-text rounded-l-lg border border-secondary-light px-3 py-1.5 outline-none transition-colors dark:border-purple-dark',
                historyView === 'list' &&
                  'bg-secondary-light text-white dark:bg-purple-dark',
              )}
            >
              <FormatListBulletedIcon sx={{ fontSize: 15 }} />
            </button>
          </Tooltip>
          <Tooltip title={interfaceLang.popup.history.calendarView}>
            <button
              type="button"
              onClick={() => handleChangeHistoryView('calendar')}
              className={cn(
                'theme-text rounded-r-lg border border-l-0 border-secondary-light px-3 py-1.5 outline-none transition-colors dark:border-purple-dark',
                historyView === 'calendar' &&
                  'bg-secondary-light text-white dark:bg-purple-dark',
              )}
            >
              <CalendarMonthIcon sx={{ fontSize: 15 }} />
            </button>
          </Tooltip>
        </div>
      </div>

      {historyView === 'list' ? (
        <>
          <div className="h-[118px]">
            <div className="flex gap-2 flex-wrap justify-start">
              {historyDates.map(({ name, onClick, isSelected }) => (
                <Button
                  key={name}
                  onClick={onClick}
                  variant={
                    isSelected ? TypeButton.SECONDARY : TypeButton.PRIMARY
                  }
                  classes="w-[85px]"
                >
                  {name}
                </Button>
              ))}
            </div>
          </div>
          <PaginationHistoryPages
            pages={pages}
            setCurrentPage={handleSetCurrentPage}
            currentPage={currentPage}
          />
        </>
      ) : (
        <CalendarHeatmap
          dates={dates}
          rangeMonths={6}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
          showHeader={false}
          size="dense"
        />
      )}

      {historyView === 'list' &&
        (!!selectedDate ? (
          <span className="text-[14px] font-[700]">{fullMonthName}</span>
        ) : (
          <span className="text-white text-[14px] font-[700] font-bold dark:text-black select-none">
            1
          </span>
        ))}
      <StudyTimeInfoForDay
        date={selectedDate}
        isLastTimeNeeded={false}
        classes="mt-0"
        sxList="mt-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      />
    </Container>
  )
}

export default HistoryPage
