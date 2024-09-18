import { Language, TimePeriod } from '../../types'
import { formatLanguageDate } from '../../helpers'
import { DATE_SHORT_DAY_FORMAT } from '../../constants'

export function getUniqStudyDays(
  dates: TimePeriod[],
  lang: Language,
): Array<string> {
  const newData = dates.map(date => {
    return formatLanguageDate(date.endDate, DATE_SHORT_DAY_FORMAT, lang)
  })

  return [...new Set(newData)].sort()
}
