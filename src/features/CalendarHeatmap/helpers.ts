import { Language, TimePeriod } from '../../types'

import { CalendarHeatmapDay, CalendarHeatmapWeek } from './types'

const DAYS_IN_WEEK = 7
const MAX_INTENSITY = 4

function getStartOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date)

  nextDate.setDate(nextDate.getDate() + days)

  return nextDate
}

function getMondayBasedDayIndex(date: Date): number {
  return (date.getDay() + 6) % DAYS_IN_WEEK
}

function getCalendarStartDate(date: Date): Date {
  return addDays(getStartOfDay(date), -getMondayBasedDayIndex(date))
}

function getCalendarEndDate(date: Date): Date {
  return addDays(
    getStartOfDay(date),
    DAYS_IN_WEEK - 1 - getMondayBasedDayIndex(date),
  )
}

function getDayIntensity(totalTime: number, maxTime: number): number {
  if (!totalTime || !maxTime) return 0

  return Math.max(
    1,
    Math.min(MAX_INTENSITY, Math.ceil((totalTime / maxTime) * MAX_INTENSITY)),
  )
}

export function getDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function getTodayDateKey(): string {
  return getDateKey(new Date())
}

export function formatHeatmapDate(date: Date, language: Language): string {
  return date.toLocaleDateString(language, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function getHeatmapMonthLabels(
  weeks: CalendarHeatmapWeek[],
  language: Language,
): string[] {
  return weeks.map(week => {
    const firstMonthDay = week.find(day => day.date.getDate() === 1)

    if (!firstMonthDay) return ''

    return firstMonthDay.date.toLocaleDateString(language, { month: 'short' })
  })
}

export function getCalendarHeatmapWeeks(
  dates: TimePeriod[],
  rangeMonths = 12,
): CalendarHeatmapWeek[] {
  const today = getStartOfDay(new Date())
  const startDate = getStartOfDay(
    new Date(today.getFullYear(), today.getMonth() - rangeMonths + 1, 1),
  )
  const calendarStartDate = getCalendarStartDate(startDate)
  const calendarEndDate = getCalendarEndDate(today)
  const timeByDate = dates.reduce((acc, { endDate, totalTimeForSession }) => {
    const dateKey = getDateKey(new Date(endDate))
    const currentValue = acc.get(dateKey) || {
      totalTime: 0,
      sessionsCount: 0,
    }

    acc.set(dateKey, {
      totalTime: currentValue.totalTime + totalTimeForSession,
      sessionsCount: currentValue.sessionsCount + 1,
    })

    return acc
  }, new Map<string, { totalTime: number; sessionsCount: number }>())

  const heatmapDays: Omit<CalendarHeatmapDay, 'intensity'>[] = []

  for (
    let date = calendarStartDate;
    date <= calendarEndDate;
    date = addDays(date, 1)
  ) {
    const dateKey = getDateKey(date)
    const dateData = timeByDate.get(dateKey)
    const day = getStartOfDay(date)

    heatmapDays.push({
      date: day,
      dateKey,
      totalTime: dateData?.totalTime || 0,
      sessionsCount: dateData?.sessionsCount || 0,
      isFuture: day > today,
    })
  }

  const maxTime = Math.max(...heatmapDays.map(day => day.totalTime), 0)
  const weeks: CalendarHeatmapWeek[] = []
  let currentWeek: CalendarHeatmapWeek = []

  heatmapDays.forEach(day => {
    currentWeek.push({
      ...day,
      intensity: day.isFuture ? 0 : getDayIntensity(day.totalTime, maxTime),
    })

    if (currentWeek.length === DAYS_IN_WEEK) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  })

  return weeks
}

export function getSelectedHeatmapDay(
  weeks: CalendarHeatmapWeek[],
  selectedDateKey: string,
): CalendarHeatmapDay | undefined {
  return weeks.flat().find(day => day.dateKey === selectedDateKey)
}
