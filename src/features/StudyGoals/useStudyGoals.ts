import { useEffect, useMemo, useState } from 'react'

import { getStudyStreak } from '../../NavigationPages/StatisticsPage/helpers'
import { useAppSelector } from '../../hooks/useAppSelector'

import { getWeeklyStudyPlan } from './planning'
import { getNextStreakMilestone } from './milestones'
import { getNextLocalDay, getStudyGoalProgress } from './helpers'
import { normalizeStudyGoalsConfiguration } from './configuration'

export function useStudyGoals() {
  const sessions = useAppSelector(state => state.TimerLogsReducer.dates)
  const storedConfiguration = useAppSelector(
    state => state.SettingReducer.studyGoals,
  )
  const legacyDailyGoalMinutes = useAppSelector(
    state => state.SettingReducer.dailyGoalMinutes,
  )
  const [now, setNow] = useState(Date.now)

  useEffect(() => {
    let timeout: number
    function refresh(): void {
      const currentTime = Date.now()
      setNow(currentTime)
      window.clearTimeout(timeout)
      timeout = window.setTimeout(
        refresh,
        getNextLocalDay(currentTime) - currentTime + 50,
      )
    }
    refresh()
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)

    return () => {
      window.clearTimeout(timeout)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])

  const configuration = useMemo(
    () =>
      normalizeStudyGoalsConfiguration(
        storedConfiguration,
        legacyDailyGoalMinutes,
      ),
    [storedConfiguration, legacyDailyGoalMinutes],
  )
  const progress = useMemo(
    () => getStudyGoalProgress(sessions, configuration, Date.now()),
    [sessions, configuration, now],
  )
  const weeklyPlan = useMemo(
    () => getWeeklyStudyPlan(sessions, configuration, Date.now()),
    [sessions, configuration, now],
  )
  const streak = useMemo(
    () => getStudyStreak(sessions, Date.now()),
    [sessions, now],
  )

  return {
    configuration,
    progress,
    weeklyPlan,
    streak,
    nextMilestone: getNextStreakMilestone(streak.currentStreak),
  }
}
