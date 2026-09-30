import React from 'react'

import { cn } from '../../utils'
import { Locale } from '../../types'
import ProgressBar from '../../components/ProgressBar'

import { StudyGoal, StudyGoalsConfiguration, GoalProgress } from './types'

export function getGoalLabel(
  goal: StudyGoal,
  locale: Locale['studyGoals'],
): string {
  if (goal.kind === 'daily-total') return locale.dailyTotal

  if (goal.kind === 'weekly-total') return locale.weeklyTotal

  return goal.activityNames[0]
}

export function formatStudyDuration(
  seconds: number,
  locale: Locale['studyGoals'],
): string {
  const wholeSeconds = Math.max(0, Math.floor(seconds))
  const minutes = Math.floor(wholeSeconds / 60)
  const remainingSeconds = wholeSeconds % 60

  if (remainingSeconds === 0) return `${minutes} ${locale.minutes}`

  if (minutes === 0) return `${remainingSeconds} ${locale.seconds}`

  return `${minutes} ${locale.minutes} ${remainingSeconds} ${locale.seconds}`
}

type StudyGoalsViewProps = {
  locale: Locale['studyGoals']
  configuration: StudyGoalsConfiguration
  progress: GoalProgress[]
  compact: boolean
  onManage: () => void
}

export function StudyGoalsView({
  locale,
  configuration,
  progress,
  compact,
  onManage,
}: StudyGoalsViewProps): JSX.Element {
  const visibleProgress = compact
    ? progress.filter(
        item =>
          configuration.goals.find(goal => goal.id === item.goalId)?.kind !==
          'weekly-activity',
      )
    : progress

  return (
    <section
      className={cn(
        'theme-text py-3',
        compact && 'border-t border-gray-200 dark:border-purple-dark',
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-bold">{locale.title}</h2>
        <button
          type="button"
          onClick={onManage}
          className="rounded px-1 py-1 text-xs font-semibold text-goal-light underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 dark:text-goal-dark"
        >
          {locale.manage}
        </button>
      </div>
      {!progress.length && (
        <div className="mt-2 text-xs leading-relaxed">
          <p className="font-semibold">{locale.empty}</p>
          <p className="mt-1">{locale.emptyDescription}</p>
        </div>
      )}
      {visibleProgress.map(item => {
        const goal = configuration.goals.find(
          existing => existing.id === item.goalId,
        )

        if (!goal) return null

        const label =
          goal.kind === 'daily-total'
            ? locale.today
            : goal.kind === 'weekly-total'
              ? locale.thisWeek
              : getGoalLabel(goal, locale)

        return (
          <div key={goal.id} className="mt-3">
            <div className="flex items-baseline justify-between gap-3 text-xs">
              <span className="min-w-0 break-words font-semibold">{label}</span>
              <span className="shrink-0 tabular-nums">
                {Math.floor(item.completedSeconds / 60)} / {goal.targetMinutes}{' '}
                {locale.minutes}
              </span>
            </div>
            <div
              role="progressbar"
              aria-label={label}
              aria-valuenow={item.percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuetext={`${Math.floor(item.completedSeconds / 60)} / ${goal.targetMinutes} ${locale.minutes}`}
              className="mt-2"
            >
              <ProgressBar percents={item.percent} />
            </div>
            {item.isComplete && (
              <p className="mt-1 text-xs font-semibold text-green-800 dark:text-green-200">
                {locale.complete}
              </p>
            )}
          </div>
        )
      })}
      {compact && !visibleProgress.length && progress.length > 0 && (
        <p className="mt-2 text-xs">
          {locale.thisWeek}: {progress.filter(item => item.isComplete).length} /{' '}
          {progress.length} · {locale.weeklyActivity}
        </p>
      )}
      {!compact && progress.length > 0 && (
        <p className="mt-2 text-xs">
          {locale.thisWeek} · {locale.completedOnly}
        </p>
      )}
    </section>
  )
}
