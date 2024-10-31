import {
  Language,
  NotificationSettingState,
  ThemeVariants,
} from '../../../types'

export interface Setting {
  language: Language
  theme: ThemeVariants
  saveStateAfterClose: boolean
  notification: NotificationSettingState
}
