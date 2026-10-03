import React from 'react'

import { TimePeriod } from '../../types'
import { useTranslate } from '../../hooks/useTranslate'
import { useAppSelector } from '../../hooks/useAppSelector'

import { useStudyGoals } from './useStudyGoals'
import { getSessionGoalProgress } from './sessionContribution'
import { formatStudyDuration, getGoalLabel } from './GoalProgress'

export default function SessionProgress({
  session,
}: {
  session: TimePeriod
}): JSX.Element | null {
  const { interfaceLang } = useTranslate()
  const { configuration } = useStudyGoals()
  const sessions = useAppSelector(state => state.TimerLogsReducer.dates)
  const progress = getSessionGoalProgress(sessions, configuration, session)
  const locale = interfaceLang.studyGoals

  if (!progress.length) return null

  return (
    <section
      aria-label={locale.sessionProgress}
      className="theme-text mt-4 border-y border-[#eadeda] py-4 dark:border-[#3b2440]"
    >
      <h2 className="text-sm font-bold">{locale.sessionProgress}</h2>
      <p className="mt-1 text-xs text-[#665c57] dark:text-[#d2c7d2]">
        {locale.sessionContribution}
      </p>
      <div className="mt-3 space-y-4">
        {progress.map(item => {
          const label = getGoalLabel(item.goal, locale)
          const addedDuration = formatStudyDuration(item.addedSeconds, locale)
          const percent = item.beforePercent + item.addedPercent

          return (
            <div key={item.goal.id}>
              <div className="mb-2 flex items-baseline justify-between gap-3 text-xs">
                <span className="min-w-0 break-words font-semibold">
                  {label}
                </span>
                <span className="shrink-0 font-bold tabular-nums text-goal-light dark:text-goal-dark">
                  +{addedDuration}
                </span>
              </div>
              <div
                role="progressbar"
                aria-label={label}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.floor(percent)}
                aria-valuetext={`${formatStudyDuration(item.completedSeconds, locale)} / ${item.goal.targetMinutes} ${locale.minutes}; +${addedDuration}`}
                className="flex h-3 overflow-hidden rounded-full bg-[#eadeda] dark:bg-[#2d202e]"
              >
                <div
                  className="h-full shrink-0 bg-goal-light dark:bg-purple-light"
                  style={{ width: `${item.beforePercent}%` }}
                />
                <div
                  data-session-contribution
                  className="h-full shrink-0 bg-goal-light dark:bg-purple-light"
                  style={{
                    width: `${item.addedPercent}%`,
                    backgroundImage:
                      'repeating-linear-gradient(135deg, transparent, transparent 4px, rgba(255, 255, 255, 0.55) 4px, rgba(255, 255, 255, 0.55) 8px)',
                  }}
                />
              </div>
              <p className="mt-1 text-right text-xs tabular-nums text-[#665c57] dark:text-[#d2c7d2]">
                {formatStudyDuration(item.completedSeconds, locale)} /{' '}
                {item.goal.targetMinutes} {locale.minutes}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
