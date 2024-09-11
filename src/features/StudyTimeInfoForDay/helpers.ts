import { Language, Locale, TimePeriod } from '../../types'
import { formatLanguageDate, getTotalTimeForDate } from '../../helpers'
import { DATE_DAY_FORMAT, DATE_TIME_FORMAT } from '../../constants'
import { customizedTime, formatTime } from '../../components/TrackTime/helpers'

export function customizedPeriod(
  dates: TimePeriod,
  language: Language,
): string {
  if (!dates) return ''

  const { startDate, endDate } = dates

  if (!startDate || !endDate) return ''

  const formattedStartDate = formatLanguageDate(
    startDate,
    DATE_DAY_FORMAT,
    language,
  )
  const formattedStartTime = formatLanguageDate(
    startDate,
    DATE_TIME_FORMAT,
    language,
  )
  const formattedEndDate = formatLanguageDate(
    endDate,
    DATE_DAY_FORMAT,
    language,
  )
  const formattedEndTime = formatLanguageDate(
    endDate,
    DATE_TIME_FORMAT,
    language,
  )

  if (formattedStartDate === formattedEndDate) {
    return `${formattedStartDate}, ${formattedStartTime} - ${formattedEndTime}`
  }

  return `${formattedStartDate} ${formattedStartTime} - ${formattedEndDate} ${formattedEndTime}`
}

export function totalElapsedTime(dates: TimePeriod[], locale: Locale): string {
  const now = Date.now()

  const totalTime = getTotalTimeForDate(now, dates)

  const customTime = customizedTime(formatTime(totalTime, false), locale)

  return customTime
    .split(' ')
    .map(item => (item.startsWith('0') ? '' : item))
    .join(' ')
}
