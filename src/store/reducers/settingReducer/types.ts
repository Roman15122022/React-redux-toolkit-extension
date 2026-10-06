import {
  Language,
  NotificationSettingState,
  ThemeVariants,
} from '../../../types'
import { StudyGoalsConfiguration } from '../../../features/StudyGoals/types'
import { SessionTemplate } from '../../../features/SessionTemplates/types'

export interface Setting {
  sessionTemplates?: SessionTemplate[]
  language: Language
  theme: ThemeVariants
  saveStateAfterClose: boolean
  dailyGoalMinutes?: number
  studyGoals?: StudyGoalsConfiguration
  notification: NotificationSettingState
}
