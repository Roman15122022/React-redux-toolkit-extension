export type StudyGoalKind = 'daily-total' | 'weekly-total' | 'weekly-activity'

export type StudyGoal = {
  id: string
  kind: StudyGoalKind
  targetMinutes: number
  enabled: boolean
  activityNames: string[]
}

export type StudyGoalsConfiguration = {
  version: 1
  goals: StudyGoal[]
  studyWeekdays: number[]
  maxDailyMinutes: number
}

export type GoalProgress = {
  goalId: string
  completedSeconds: number
  targetSeconds: number
  remainingSeconds: number
  percent: number
  isComplete: boolean
}

export type WeeklyPlanDay = {
  dateKey: string
  totalSeconds: number
  activitySeconds: { goalId: string; seconds: number }[]
  generalSeconds: number
}

export type WeeklyStudyPlan = {
  days: WeeklyPlanDay[]
  unscheduledSeconds: number
  unscheduledByGoal: { goalId: string; seconds: number }[]
}
