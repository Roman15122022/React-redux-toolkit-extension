import React, { useEffect, useMemo, useRef, useState } from 'react'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

import { cn } from '../../utils'

import { DatePickerProps } from './types'

const WEEK_DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const DAYS_IN_WEEK = 7
const VISIBLE_DAYS_COUNT = 42

function parseDate(value?: string): Date | null {
  if (!value) return null

  const [year, month, day] = value.split('-').map(Number)

  if (!year || !month || !day) return null

  return new Date(year, month - 1, day)
}

function getStartOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function getDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function formatDate(value: string): string {
  const date = parseDate(value)

  if (!date) return ''

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')

  return `${day}.${month}.${date.getFullYear()}`
}

function getMondayBasedDayIndex(date: Date): number {
  return (date.getDay() + 6) % DAYS_IN_WEEK
}

function getCalendarDays(visibleDate: Date): Array<Date | null> {
  const year = visibleDate.getFullYear()
  const month = visibleDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startOffset = getMondayBasedDayIndex(firstDay)
  const calendarDays: Array<Date | null> = []

  for (let index = 0; index < startOffset; index += 1) {
    calendarDays.push(null)
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    calendarDays.push(new Date(year, month, day))
  }

  while (calendarDays.length < VISIBLE_DAYS_COUNT) {
    calendarDays.push(null)
  }

  return calendarDays
}

const DatePicker = ({
  value,
  onChange,
  placeholder = 'Select date',
  min,
  max,
  classes,
}: DatePickerProps): JSX.Element => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const selectedDate = parseDate(value)
  const minDate = parseDate(min)
  const maxDate = parseDate(max)
  const [isOpen, setIsOpen] = useState(false)
  const [visibleDate, setVisibleDate] = useState<Date>(
    selectedDate || new Date(),
  )
  const calendarDays = useMemo(
    () => getCalendarDays(visibleDate),
    [visibleDate],
  )
  const selectedDateKey = selectedDate ? getDateKey(selectedDate) : ''

  useEffect(() => {
    function handleDocumentMouseDown(event: MouseEvent): void {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleDocumentMouseDown)

    return () => {
      document.removeEventListener('mousedown', handleDocumentMouseDown)
    }
  }, [])

  useEffect(() => {
    if (selectedDate) {
      setVisibleDate(selectedDate)
    }
  }, [value])

  function toggleCalendar(): void {
    if (!isOpen) {
      setVisibleDate(selectedDate || new Date())
    }

    setIsOpen(prevState => !prevState)
  }

  function changeMonth(offset: number): void {
    setVisibleDate(
      prevState =>
        new Date(prevState.getFullYear(), prevState.getMonth() + offset, 1),
    )
  }

  function isDateDisabled(date: Date): boolean {
    const timestamp = getStartOfDay(date).getTime()

    return Boolean(
      (minDate && timestamp < getStartOfDay(minDate).getTime()) ||
        (maxDate && timestamp > getStartOfDay(maxDate).getTime()),
    )
  }

  function handleSelectDate(date: Date): void {
    if (isDateDisabled(date)) return

    onChange(getDateKey(date))
    setIsOpen(false)
  }

  return (
    <div ref={wrapperRef} className={cn('relative', classes)}>
      <button
        type="button"
        onClick={toggleCalendar}
        className={cn(
          'mt-1 flex w-full items-center justify-between rounded-lg border px-2 py-2 text-left text-[13px] outline-none transition-colors',
          'border-gray-300 bg-white text-black hover:border-secondary-light',
          'dark:border-purple-light dark:bg-black dark:text-white dark:hover:border-purple-dark',
        )}
      >
        <span className={cn(!value && 'text-gray-500 dark:text-gray-400')}>
          {value ? formatDate(value) : placeholder}
        </span>
        <CalendarMonthIcon sx={{ fontSize: 18 }} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-[60] mt-2 rounded-lg border border-secondary-light bg-white p-3 shadow-xl dark:border-purple-light dark:bg-black">
          <div className="mb-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="theme-text rounded-md p-1 hover:bg-gray-100 dark:hover:bg-[#212830]"
              aria-label="Previous month"
            >
              <ChevronLeftIcon sx={{ fontSize: 20 }} />
            </button>
            <p className="theme-text text-center text-[13px] font-bold capitalize">
              {visibleDate.toLocaleDateString(undefined, {
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="theme-text rounded-md p-1 hover:bg-gray-100 dark:hover:bg-[#212830]"
              aria-label="Next month"
            >
              <ChevronRightIcon sx={{ fontSize: 20 }} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {WEEK_DAYS.map(day => (
              <span
                key={day}
                className="text-center text-[11px] font-bold text-gray-500 dark:text-gray-400"
              >
                {day}
              </span>
            ))}

            {calendarDays.map((date, index) => {
              const dateKey = date ? getDateKey(date) : `empty-${index}`
              const isSelected = dateKey === selectedDateKey
              const disabled = date ? isDateDisabled(date) : true

              return (
                <button
                  key={dateKey}
                  type="button"
                  disabled={disabled}
                  onClick={() => date && handleSelectDate(date)}
                  className={cn(
                    'aspect-square rounded-md text-[12px] font-semibold transition-colors',
                    'disabled:pointer-events-none disabled:opacity-30',
                    date &&
                      !isSelected &&
                      'theme-text hover:bg-secondary-light hover:text-white dark:hover:bg-purple-dark',
                    isSelected &&
                      'bg-secondary-light text-white dark:bg-purple-dark',
                  )}
                >
                  {date?.getDate()}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default DatePicker
