import { Language, TimePeriod } from '../../types'
import { formatLanguageDate } from '../../helpers'
import { DATE_SHORT_DAY_FORMAT } from '../../constants'

export function getUniqStudyDays(
  dates: TimePeriod[],
  lang: Language,
): Array<string> {
  const sortedDates = [...dates].sort((a, b) => a.endDate - b.endDate)

  const newData = sortedDates.map(date => {
    return formatLanguageDate(date.endDate, DATE_SHORT_DAY_FORMAT, lang)
  })

  return [...new Set(newData)]
}

export function getNormalizeName(name: string): string {
  const arr = name.trim().split(' ')

  const result = arr.slice(0, 2).join(' ')

  return result.replace(/,/g, '')
}

export function getSegment<T>(
  arr: Array<T>,
  segmentSize: number,
  segmentNumber: number,
): Array<T> {
  const startIndex = (segmentNumber - 1) * segmentSize
  const endIndex = startIndex + segmentSize

  return arr.slice(startIndex, endIndex)
}
