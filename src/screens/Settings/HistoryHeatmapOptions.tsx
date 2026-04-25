import React, { useEffect } from 'react'

import { useTranslate } from '../../hooks/useTranslate'
import { useAppSelector } from '../../hooks/useAppSelector'
import StudyTimeInfoForDay from '../../features/StudyTimeInfoForDay'
import CalendarHeatmap from '../../features/CalendarHeatmap'

function getTodayTimestamp(): number {
  return new Date().setHours(0, 0, 0, 0)
}

const HistoryHeatmapOptions = (): JSX.Element => {
  const { dates } = useAppSelector(state => state.TimerLogsReducer)
  const { interfaceLang } = useTranslate()
  const locale = interfaceLang.popup.statistics.heatmap
  const [selectedDate, setSelectedDate] = React.useState(getTodayTimestamp)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)

    urlParams.set('history', 'true')
    urlParams.set('period', '12')
    window.history.pushState({}, '', `${window.location.pathname}?${urlParams}`)
  }, [])

  return (
    <div className="mx-auto max-w-[1220px] text-black dark:text-white">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-2xl font-bold leading-tight text-black dark:text-white">
            {locale.title}
          </p>
          <p className="mt-1 text-[13px] text-gray-600 dark:text-gray-300">
            {locale.description}
          </p>
        </div>
        <span className="shrink-0 rounded-md bg-secondary-light px-4 py-2 text-[13px] font-bold text-white dark:bg-purple-dark">
          {locale.lastYear}
        </span>
      </div>

      <div className="rounded-lg border border-gray-800 bg-white p-5 shadow-sm dark:border-purple-dark dark:bg-black">
        <CalendarHeatmap
          dates={dates}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          rangeMonths={12}
          showHeader={false}
          size="comfortable"
        />
      </div>

      <div className="mt-4 rounded-lg border border-gray-800 bg-white px-5 py-4 dark:border-purple-dark dark:bg-black">
        <StudyTimeInfoForDay
          date={selectedDate}
          isLastTimeNeeded={false}
          classes="mt-0 text-black dark:text-white"
          sxList="mt-1 h-[150px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        />
      </div>
    </div>
  )
}

export default HistoryHeatmapOptions
