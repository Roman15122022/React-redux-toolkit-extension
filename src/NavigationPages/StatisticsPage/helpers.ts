import type { StudyStreak, TimePeriod } from '../../types'

import { Period } from './types'

const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000

function getCalendarDayNumber(timestamp: number): number {
  const date = new Date(timestamp)

  return (
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) /
    MILLISECONDS_IN_DAY
  )
}

export function getStudyStreak(
  dates: TimePeriod[],
  todayTimestamp: number,
): StudyStreak {
  const studyDays = [
    ...new Set(dates.map(date => getCalendarDayNumber(date.endDate))),
  ].sort((firstDay, secondDay) => firstDay - secondDay)

  if (studyDays.length === 0) {
    return {
      currentStreak: 0,
      bestStreak: 0,
      isRecoveryDayUsed: false,
    }
  }

  let streakLength = 1
  let bestStreak = 1
  let isRecoveryDayUsed = false

  for (let index = 1; index < studyDays.length; index += 1) {
    const dayDifference = studyDays[index] - studyDays[index - 1]

    if (dayDifference === 1) {
      streakLength += 1
    } else if (dayDifference === 2 && !isRecoveryDayUsed) {
      streakLength += 1
      isRecoveryDayUsed = true
    } else {
      streakLength = 1
      isRecoveryDayUsed = false
    }

    bestStreak = Math.max(bestStreak, streakLength)
  }

  const todayDayNumber = getCalendarDayNumber(todayTimestamp)
  const daysSinceLatestStudy = todayDayNumber - studyDays.at(-1)
  const isPendingRecoveryDay = daysSinceLatestStudy === 2 && !isRecoveryDayUsed
  const isCurrentStreakActive =
    daysSinceLatestStudy <= 1 || isPendingRecoveryDay

  return {
    currentStreak: isCurrentStreakActive ? streakLength : 0,
    bestStreak,
    isRecoveryDayUsed:
      isCurrentStreakActive && (isRecoveryDayUsed || isPendingRecoveryDay),
  }
}

export function getDatesByPeriod(
  dates: TimePeriod[],
  period: Period,
): TimePeriod[] {
  const periodStr = String(period)

  if (periodStr === '0') {
    return dates
  }

  const now = new Date()

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime()

  const endOfToday = startOfToday + 24 * 60 * 60 * 1000 - 1

  let startTime: number

  switch (periodStr) {
    case '1':
      startTime = startOfToday
      break
    case '7':
      startTime = startOfToday - 6 * 24 * 60 * 60 * 1000
      break
    case '30':
      startTime = startOfToday - 29 * 24 * 60 * 60 * 1000
      break
  }

  return dates.filter(
    item => item.endDate >= startTime && item.startDate <= endOfToday,
  )
}
