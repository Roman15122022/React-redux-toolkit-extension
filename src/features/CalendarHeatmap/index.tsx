import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Tooltip } from '@mui/material'

import { cn } from '../../utils'
import { Locale } from '../../types'
import { fullFormatTime } from '../../NavigationPages/TrackTimePage/helpers'
import { useTranslate } from '../../hooks/useTranslate'

import { CalendarHeatmapDay, CalendarHeatmapProps } from './types'
import {
  formatHeatmapDate,
  getCalendarHeatmapWeeks,
  getDateKey,
  getHeatmapMonthLabels,
  getSelectedHeatmapDay,
  getTodayDateKey,
} from './helpers'

const INTENSITY_CLASSES = [
  'border-gray-400 bg-white dark:border-[#313845] dark:bg-[#212830]',
  'border-[#ffd6cc] bg-[#ffd6cc] dark:border-[#14351f] dark:bg-[#14351f]',
  'border-[#ffad99] bg-[#ffad99] dark:border-[#1f6f3a] dark:bg-[#1f6f3a]',
  'border-[#ff8366] bg-[#ff8366] dark:border-[#2ea44f] dark:bg-[#2ea44f]',
  'border-secondary-light bg-secondary-light dark:border-[#56d364] dark:bg-[#56d364]',
]

const SIZE_CONFIG = {
  dense: {
    cellSize: 11,
    cellGap: 2,
    weekdayWidth: 20,
    monthLabelClass: 'h-3 text-[9px] leading-3',
    weekdayLabelClass: 'text-[8px]',
  },
  compact: {
    cellSize: 10,
    cellGap: 3,
    weekdayWidth: 24,
    monthLabelClass: 'h-4 text-[10px] leading-4',
    weekdayLabelClass: 'text-[9px]',
  },
  comfortable: {
    cellSize: 16,
    cellGap: 4,
    weekdayWidth: 24,
    monthLabelClass: 'h-4 text-[10px] leading-4',
    weekdayLabelClass: 'text-[9px]',
  },
}

function getWeekdayLabels(locale: Locale['popup']): string[] {
  const { monday, wednesday, friday } = locale.dayOfWeekShort

  return [monday, '', wednesday, '', friday, '', '']
}

const CalendarHeatmap = ({
  dates,
  selectedDate,
  onSelectDate,
  rangeMonths = 12,
  showHeader = true,
  size = 'compact',
}: CalendarHeatmapProps): JSX.Element => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { interfaceLang, language } = useTranslate()
  const locale = interfaceLang.popup.statistics.heatmap
  const weeks = useMemo(
    () => getCalendarHeatmapWeeks(dates, rangeMonths),
    [dates, rangeMonths],
  )
  const monthLabels = useMemo(
    () => getHeatmapMonthLabels(weeks, language),
    [weeks, language],
  )
  const weekdayLabels = useMemo(
    () => getWeekdayLabels(interfaceLang.popup),
    [interfaceLang],
  )
  const [internalSelectedDateKey, setInternalSelectedDateKey] =
    useState(getTodayDateKey)
  const isControlled = selectedDate !== undefined
  const selectedDateKey = isControlled
    ? selectedDate
      ? getDateKey(new Date(selectedDate))
      : ''
    : internalSelectedDateKey
  const selectedDay = useMemo(
    () => getSelectedHeatmapDay(weeks, selectedDateKey),
    [weeks, selectedDateKey],
  )
  const {
    cellSize,
    cellGap,
    weekdayWidth,
    monthLabelClass,
    weekdayLabelClass,
  } = SIZE_CONFIG[size]

  useEffect(() => {
    if (!scrollRef.current) return

    scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
  }, [weeks.length])

  function getFormattedTime(totalTime: number): string {
    if (!totalTime) return locale.noStudyTime

    return fullFormatTime(totalTime, interfaceLang, false)
  }

  function getSessionsLabel(sessionsCount: number): string {
    return sessionsCount === 1 ? locale.session : locale.sessions
  }

  function getDayTooltip(day: CalendarHeatmapDay): string {
    return `${formatHeatmapDate(day.date, language)} - ${getFormattedTime(
      day.totalTime,
    )}`
  }

  function handleSelectDay(day: CalendarHeatmapDay): void {
    setInternalSelectedDateKey(day.dateKey)
    onSelectDate?.(day.date.getTime())
  }

  return (
    <section className="my-2 max-w-full select-none overflow-hidden">
      {showHeader && (
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="theme-text text-base font-bold leading-tight">
              {locale.title}
            </p>
            <p className="mt-1 text-[11px] leading-snug text-gray-600 dark:text-gray-300">
              {locale.description}
            </p>
          </div>
          <span className="whitespace-nowrap rounded-md bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-700 dark:bg-[#212830] dark:text-gray-200">
            {rangeMonths === 12
              ? locale.lastYear
              : locale.lastMonths.replace('{count}', String(rangeMonths))}
          </span>
        </div>
      )}

      <div
        ref={scrollRef}
        className="mt-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="min-w-max">
          <div
            className="grid"
            style={{
              gap: `${cellGap}px`,
              gridTemplateColumns: `repeat(${weeks.length}, ${cellSize}px)`,
              marginLeft: `${weekdayWidth + 8}px`,
            }}
          >
            {monthLabels.map((label, index) => (
              <span
                key={`${label}-${index}`}
                className={cn(
                  monthLabelClass,
                  'text-gray-500 dark:text-gray-300',
                )}
              >
                {label}
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <div className="grid grid-rows-7" style={{ gap: `${cellGap}px` }}>
              {weekdayLabels.map((label, index) => (
                <span
                  key={`${label}-${index}`}
                  className={cn(
                    weekdayLabelClass,
                    'text-gray-500 dark:text-gray-300',
                  )}
                  style={{
                    height: `${cellSize}px`,
                    lineHeight: `${cellSize}px`,
                    width: `${weekdayWidth}px`,
                  }}
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="flex" style={{ gap: `${cellGap}px` }}>
              {weeks.map((week, weekIndex) => (
                <div
                  key={week[0]?.dateKey || weekIndex}
                  className="flex flex-col"
                  style={{ gap: `${cellGap}px` }}
                >
                  {week.map(day => {
                    const isSelected = day.dateKey === selectedDateKey

                    return (
                      <Tooltip key={day.dateKey} title={getDayTooltip(day)}>
                        <button
                          type="button"
                          disabled={day.isFuture}
                          aria-label={getDayTooltip(day)}
                          onClick={() => handleSelectDay(day)}
                          className={cn(
                            'rounded-[2px] border transition-transform',
                            'hover:scale-125 disabled:pointer-events-none disabled:border-transparent disabled:bg-transparent',
                            INTENSITY_CLASSES[day.intensity],
                            isSelected &&
                              'ring-2 ring-secondary-light ring-offset-1 ring-offset-white dark:ring-purple-light dark:ring-offset-black',
                          )}
                          style={{
                            height: `${cellSize}px`,
                            width: `${cellSize}px`,
                          }}
                        />
                      </Tooltip>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3 pl-0 pr-3">
        <div className="theme-text text-[12px]">
          <p className="text-[13px] font-bold leading-tight">
            {selectedDay
              ? formatHeatmapDate(selectedDay.date, language)
              : locale.today}
          </p>
          <p className="mt-0.5 text-[11px] text-gray-600 dark:text-gray-300">
            {selectedDay ? getFormattedTime(selectedDay.totalTime) : '-'} ·{' '}
            {selectedDay?.sessionsCount || 0}{' '}
            {getSessionsLabel(selectedDay?.sessionsCount || 0)}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1 text-[10px] text-gray-600 dark:text-gray-200">
          <span>{locale.less}</span>
          {INTENSITY_CLASSES.map((classes, index) => (
            <span
              key={classes}
              className={cn('h-2.5 w-2.5 rounded-[2px] border', classes)}
              aria-label={`${locale.intensity} ${index}`}
            />
          ))}
          <span>{locale.more}</span>
        </div>
      </div>
    </section>
  )
}

export default CalendarHeatmap
