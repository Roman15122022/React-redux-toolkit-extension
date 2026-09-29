import React from 'react'

import StudyStreakProgress from '../StudyStreak'
import { useTranslate } from '../../hooks/useTranslate'

import WeeklyPlan from './WeeklyPlan'
import { useStudyGoals } from './useStudyGoals'
import { StudyGoalsView } from './GoalProgress'

export default function StudyGoals({
  compact = true,
  showStreak = false,
}: {
  compact?: boolean
  showStreak?: boolean
}): JSX.Element {
  const { interfaceLang, language } = useTranslate()
  const { configuration, progress, weeklyPlan, streak, nextMilestone } =
    useStudyGoals()
  const locale = interfaceLang.studyGoals

  function openGoalSettings(): void {
    chrome.tabs.create({ url: 'options.html#study-goals' })
  }

  return (
    <div>
      <StudyGoalsView
        locale={locale}
        configuration={configuration}
        progress={progress}
        compact={compact}
        onManage={openGoalSettings}
      />
      {showStreak && (
        <StudyStreakProgress
          locale={interfaceLang.popup.statistics.streak}
          streak={streak}
        />
      )}
      {!compact && nextMilestone !== null && (
        <p className="theme-text mb-3 text-xs">
          {locale.nextMilestone.replace('{days}', String(nextMilestone))}
        </p>
      )}
      {!compact && (
        <WeeklyPlan
          locale={locale}
          language={language}
          configuration={configuration}
          plan={weeklyPlan}
        />
      )}
    </div>
  )
}
