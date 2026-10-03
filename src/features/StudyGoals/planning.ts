import { TimePeriod } from '../../types'

import {
  StudyGoalsConfiguration,
  WeeklyStudyPlan,
  WeeklyPlanDay,
} from './types'
import {
  getLocalDateKey,
  getLocalDayStart,
  getLocalWeekBounds,
  getNextLocalDay,
  getStudyGoalProgress,
  getValidCompletedSessions,
} from './helpers'

function distributeSeconds(
  capacities: number[],
  requestedSeconds: number,
): number[] {
  const allocated = capacities.map(() => 0)
  let remaining = requestedSeconds

  while (remaining > 0) {
    const available = capacities
      .map((capacity, index) => ({ capacity, index }))
      .filter(item => item.capacity > allocated[item.index])

    if (!available.length) break

    const share = Math.max(1, Math.floor(remaining / available.length))
    for (
      let availableIndex = 0;
      availableIndex < available.length;
      availableIndex += 1
    ) {
      const { capacity, index } = available[availableIndex]
      const added = Math.min(share, capacity - allocated[index], remaining)
      allocated[index] += added
      remaining -= added
    }
  }

  return allocated
}

export function getWeeklyStudyPlan(
  sessions: TimePeriod[],
  configuration: StudyGoalsConfiguration,
  now: number,
): WeeklyStudyPlan {
  const progress = getStudyGoalProgress(sessions, configuration, now)
  const weeklyGoals = configuration.goals.filter(
    goal => goal.enabled && goal.kind !== 'daily-total',
  )
  const activityGoals = weeklyGoals
    .filter(goal => goal.kind === 'weekly-activity')
    .sort((first, second) =>
      first.id < second.id ? -1 : first.id > second.id ? 1 : 0,
    )
  const remainingByGoal = new Map(
    progress.map(item => [item.goalId, Math.ceil(item.remainingSeconds)]),
  )
  const totalGoal = weeklyGoals.find(goal => goal.kind === 'weekly-total')
  const totalRemaining = totalGoal
    ? (remainingByGoal.get(totalGoal.id) ?? 0)
    : 0
  const activityRemaining = activityGoals.reduce(
    (total, goal) => total + (remainingByGoal.get(goal.id) ?? 0),
    0,
  )
  const demand = Math.max(totalRemaining, activityRemaining)

  if (demand === 0)
    return { days: [], unscheduledSeconds: 0, unscheduledByGoal: [] }

  const completedSessions = getValidCompletedSessions(sessions, now)
  const today = getLocalDayStart(now)
  const week = getLocalWeekBounds(now)
  const recentDate = new Date(now)
  const recentStart = new Date(
    recentDate.getFullYear(),
    recentDate.getMonth(),
    recentDate.getDate() - 13,
  ).getTime()
  const recentDailySeconds = new Map<string, number>()
  completedSessions
    .filter(session => session.endDate >= recentStart)
    .forEach(session => {
      const key = getLocalDateKey(session.endDate)
      recentDailySeconds.set(
        key,
        (recentDailySeconds.get(key) ?? 0) + session.totalTimeForSession,
      )
    })
  const dailyGoal = configuration.goals.find(
    goal => goal.enabled && goal.kind === 'daily-total',
  )
  const recommendedSeconds = recentDailySeconds.size
    ? Math.ceil(
        [...recentDailySeconds.values()].reduce(
          (total, seconds) => total + seconds,
          0,
        ) / recentDailySeconds.size,
      )
    : (dailyGoal?.targetMinutes ?? 60) * 60
  const hardLimit = configuration.maxDailyMinutes * 60
  const softLimit = Math.min(hardLimit, recommendedSeconds)
  const days: WeeklyPlanDay[] = []
  const hardCapacities: number[] = []
  const softCapacities: number[] = []

  for (let date = today; date < week.end; date = getNextLocalDay(date)) {
    if (!configuration.studyWeekdays.includes(new Date(date).getDay())) continue

    const completedToday =
      date === today ? (recentDailySeconds.get(getLocalDateKey(date)) ?? 0) : 0
    days.push({
      dateKey: getLocalDateKey(date),
      totalSeconds: 0,
      activitySeconds: [],
      generalSeconds: 0,
    })
    hardCapacities.push(Math.max(0, Math.floor(hardLimit - completedToday)))
    softCapacities.push(Math.max(0, Math.floor(softLimit - completedToday)))
  }

  const softAllocated = distributeSeconds(softCapacities, demand)
  const softTotal = softAllocated.reduce((total, seconds) => total + seconds, 0)
  const extraAllocated = distributeSeconds(
    hardCapacities.map((capacity, index) => capacity - softAllocated[index]),
    demand - softTotal,
  )
  days.forEach((day, index) => {
    day.totalSeconds = softAllocated[index] + extraAllocated[index]
  })
  const scheduledTotal = days.reduce(
    (total, day) => total + day.totalSeconds,
    0,
  )
  const unassigned = days.map(day => day.totalSeconds)
  const unscheduledByGoal: WeeklyStudyPlan['unscheduledByGoal'] = []

  activityGoals.forEach(goal => {
    const remaining = remainingByGoal.get(goal.id) ?? 0
    const allocated = distributeSeconds(unassigned, remaining)
    let scheduled = 0
    allocated.forEach((seconds, index) => {
      if (seconds > 0)
        days[index].activitySeconds.push({ goalId: goal.id, seconds })

      unassigned[index] -= seconds
      scheduled += seconds
    })

    if (scheduled < remaining)
      unscheduledByGoal.push({
        goalId: goal.id,
        seconds: remaining - scheduled,
      })
  })
  days.forEach((day, index) => {
    day.generalSeconds = unassigned[index]
  })

  if (totalGoal && scheduledTotal < totalRemaining) {
    unscheduledByGoal.push({
      goalId: totalGoal.id,
      seconds: totalRemaining - scheduledTotal,
    })
  }

  return {
    days,
    unscheduledSeconds: demand - scheduledTotal,
    unscheduledByGoal,
  }
}
