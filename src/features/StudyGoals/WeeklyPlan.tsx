import React from 'react'

import { Locale } from '../../types'

import { StudyGoalsConfiguration, WeeklyStudyPlan } from './types'
import { formatStudyDuration, getGoalLabel } from './GoalProgress'

type WeeklyPlanProps = {
  locale: Locale['studyGoals']
  language: string
  configuration: StudyGoalsConfiguration
  plan: WeeklyStudyPlan
}

export default function WeeklyPlan({
  locale,
  language,
  configuration,
  plan,
}: WeeklyPlanProps): JSX.Element {
  return (
    <details className="theme-text border-t border-gray-200 py-3 dark:border-purple-dark">
      <summary className="cursor-pointer rounded text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
        {locale.planningTitle}
      </summary>
      {!plan.days.length && plan.unscheduledSeconds === 0 && (
        <p className="mt-2 text-xs leading-relaxed">{locale.noPlan}</p>
      )}
      <ul className="mt-2 divide-y divide-gray-200 dark:divide-purple-dark">
        {plan.days.map(day => (
          <li key={day.dateKey} className="py-2 text-xs">
            <div className="flex items-baseline justify-between gap-2 font-semibold">
              <span>
                {new Date(`${day.dateKey}T12:00:00`).toLocaleDateString(
                  language,
                  { weekday: 'short', month: 'short', day: 'numeric' },
                )}
              </span>
              <span className="shrink-0 tabular-nums">
                {formatStudyDuration(day.totalSeconds, locale)}
              </span>
            </div>
            {day.activitySeconds.map(item => {
              const goal = configuration.goals.find(
                existing => existing.id === item.goalId,
              )

              return goal ? (
                <p key={item.goalId} className="mt-1 break-words">
                  {getGoalLabel(goal, locale)}:{' '}
                  {formatStudyDuration(item.seconds, locale)}
                </p>
              ) : null
            })}
            {day.generalSeconds > 0 && (
              <p className="mt-1">
                {locale.generalStudy}:{' '}
                {formatStudyDuration(day.generalSeconds, locale)}
              </p>
            )}
          </li>
        ))}
      </ul>
      {plan.unscheduledSeconds > 0 && (
        <div role="status" className="mt-2 text-xs leading-relaxed">
          <p className="font-semibold">
            {locale.unscheduled.replace(
              '{duration}',
              formatStudyDuration(plan.unscheduledSeconds, locale),
            )}
          </p>
          <p className="mt-1">{locale.adjustLimits}</p>
        </div>
      )}
    </details>
  )
}
