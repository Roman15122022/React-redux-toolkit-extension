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

export const DATE_FULL_FORMAT = 'MMMM Do YYYY, h:mm:ss a'

export const DATE_DAY_FORMAT = 'L'

export const DATE_TIME_FORMAT = 'LTS'

export const DATE_DAY_OF_WEEK_FORMAT = 'dddd'

export const MAX_SIZE_DATES = 1000

export const dayOfWeekMap: { [key in DayOfWeek]: number } = {
  [DayOfWeek.SUNDAY]: 1,
  [DayOfWeek.MONDAY]: 2,
  [DayOfWeek.TUESDAY]: 3,
  [DayOfWeek.WEDNESDAY]: 4,
  [DayOfWeek.THURSDAY]: 5,
  [DayOfWeek.FRIDAY]: 6,
  [DayOfWeek.SATURDAY]: 7,
}
