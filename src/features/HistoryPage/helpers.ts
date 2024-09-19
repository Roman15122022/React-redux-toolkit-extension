import { Language, TimePeriod } from '../../types'
import { formatLanguageDate } from '../../helpers'
import { DATE_SHORT_DAY_FORMAT } from '../../constants'

export function getUniqStudyDays(
  dates: TimePeriod[],
  lang: Language,
): Array<string> {
  const newData = dates
    .sort((date, prevDate) => date.endDate - prevDate.endDate)
    .map(date => {
      return formatLanguageDate(date.endDate, DATE_SHORT_DAY_FORMAT, lang)
    })

  return [...new Set(newData)]
}

export function getNormalizeName(name: string): string {
  const arr = name.trim().split(' ')

  const result = arr.slice(0, 2).join(' ')

  return result.replace(/,/g, '')
}
