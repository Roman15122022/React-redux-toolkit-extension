import {
  Language,
  NotificationSettingState,
  ThemeVariants,
} from '../../../types'
import { StudyGoalsConfiguration } from '../../../features/StudyGoals/types'

export interface Setting {
  language: Language
  theme: ThemeVariants
  saveStateAfterClose: boolean
  dailyGoalMinutes?: number
  studyGoals?: StudyGoalsConfiguration
  notification: NotificationSettingState
}
