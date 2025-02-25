import { DayOfWeek } from '../types'

export const TIME_IN_MS = {
  SECOND: 1000,
  MINUTE: 1000 * 60,
  HOUR: 1000 * 60 * 60,
  DAY: 1000 * 60 * 60 * 24,
}

export const TIME_IN_SECONDS = {
  SECOND: 1,
  MINUTE: 60,
  HOUR: 60 * 60,
  DAY: 60 * 60 * 24,
}

export const DATE_FULL_MONTH = 'LLL'

export const DATE_DAY_FORMAT = 'L'

export const DATE_SHORT_DAY_FORMAT = 'll'

export const DATE_TIME_FORMAT = 'LTS'

export const DATE_SHORT_TIME_FORMAT = 'LT'

export const DATE_DAY_OF_WEEK_FORMAT = 'dddd'

export const MAX_SIZE_DATES = 3000

export const dayOfWeekMap: Record<DayOfWeek, number> = {
  [DayOfWeek.SUNDAY]: 1,
  [DayOfWeek.MONDAY]: 2,
  [DayOfWeek.TUESDAY]: 3,
  [DayOfWeek.WEDNESDAY]: 4,
  [DayOfWeek.THURSDAY]: 5,
  [DayOfWeek.FRIDAY]: 6,
  [DayOfWeek.SATURDAY]: 7,
}

export const CHROME_ALARM = 'chromeAlarm'
