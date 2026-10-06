import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
  ChromeKeys,
  Language,
  NotificationSettingState,
  ThemeVariants,
} from '../../../types'
import { StudyGoal } from '../../../features/StudyGoals/types'
import {
  isStudyGoalValid,
  isValidMinutes,
  normalizeStudyGoalsConfiguration,
} from '../../../features/StudyGoals/configuration'
import { SessionTemplate } from '../../../features/SessionTemplates/types'
import {
  getTemplateError,
  normalizeSessionTemplates,
} from '../../../features/SessionTemplates/helpers'

import { Setting } from './types'

const initialState: Setting = {
  sessionTemplates: [],
  language: Language.EN,
  theme: ThemeVariants.DARK,
  saveStateAfterClose: true,
  dailyGoalMinutes: 60,
  studyGoals: normalizeStudyGoalsConfiguration(undefined, 60),
  notification: {
    isNotificationActive: true,
    periodInMinutes: 60,
  },
}

export const settingSlice = createSlice({
  name: 'locale',
  initialState,
  reducers: {
    saveSessionTemplate(state, action: PayloadAction<SessionTemplate>) {
      const templates = normalizeSessionTemplates(state.sessionTemplates)

      if (getTemplateError(action.payload, templates)) return

      const [template] = normalizeSessionTemplates([action.payload])
      const templateIndex = templates.findIndex(item => item.id === template.id)

      if (templateIndex < 0) templates.push(template)
      else templates[templateIndex] = template

      state.sessionTemplates = templates
    },
    deleteSessionTemplate(state, action: PayloadAction<string>) {
      state.sessionTemplates = normalizeSessionTemplates(
        state.sessionTemplates,
      ).filter(template => template.id !== action.payload)
    },
    moveSessionTemplate(
      state,
      action: PayloadAction<{ id: string; direction: -1 | 1 }>,
    ) {
      const templates = normalizeSessionTemplates(state.sessionTemplates)
      const currentIndex = templates.findIndex(
        template => template.id === action.payload.id,
      )
      const nextIndex = currentIndex + action.payload.direction

      if (currentIndex < 0 || nextIndex < 0 || nextIndex >= templates.length)
        return

      const [movedTemplate] = templates.splice(currentIndex, 1)
      templates.splice(nextIndex, 0, movedTemplate)
      state.sessionTemplates = templates
    },
    setLocale(state, action: PayloadAction<Language>): void {
      state.language = action.payload
    },
    toggleTheme(state, action: PayloadAction<ThemeVariants>) {
      state.theme = action.payload
    },
    toggleSaveState(state, action: PayloadAction<boolean>) {
      state.saveStateAfterClose = action.payload
    },
    setSettingsState(state, action: PayloadAction<Setting>) {
      Object.assign(state, action.payload)
      state.sessionTemplates = normalizeSessionTemplates(
        action.payload.sessionTemplates,
      )
      state.studyGoals = normalizeStudyGoalsConfiguration(
        action.payload.studyGoals,
        action.payload.dailyGoalMinutes,
      )
    },
    saveStudyGoal(state, action: PayloadAction<StudyGoal>) {
      const configuration = normalizeStudyGoalsConfiguration(
        state.studyGoals,
        state.dailyGoalMinutes,
      )

      if (!isStudyGoalValid(action.payload, configuration.goals)) return

      const goalIndex = configuration.goals.findIndex(
        goal => goal.id === action.payload.id,
      )
      const goal = {
        ...action.payload,
        activityNames: action.payload.activityNames.map(name => name.trim()),
      }

      if (goalIndex < 0) configuration.goals.push(goal)
      else configuration.goals[goalIndex] = goal

      state.studyGoals = configuration
    },
    setStudyGoalEnabled(
      state,
      action: PayloadAction<{ goalId: string; enabled: boolean }>,
    ) {
      const configuration = normalizeStudyGoalsConfiguration(
        state.studyGoals,
        state.dailyGoalMinutes,
      )
      const goal = configuration.goals.find(
        item => item.id === action.payload.goalId,
      )

      if (goal) goal.enabled = action.payload.enabled

      state.studyGoals = configuration
    },
    deleteStudyGoal(state, action: PayloadAction<string>) {
      const configuration = normalizeStudyGoalsConfiguration(
        state.studyGoals,
        state.dailyGoalMinutes,
      )
      configuration.goals = configuration.goals.filter(
        goal => goal.id !== action.payload,
      )
      state.studyGoals = configuration
    },
    setStudyPlanningLimits(
      state,
      action: PayloadAction<{
        studyWeekdays: number[]
        maxDailyMinutes: number
      }>,
    ) {
      const { studyWeekdays, maxDailyMinutes } = action.payload

      if (
        !isValidMinutes(maxDailyMinutes, 1440) ||
        !studyWeekdays.every(
          day => Number.isInteger(day) && day >= 0 && day <= 6,
        )
      )
        return

      state.studyGoals = {
        ...normalizeStudyGoalsConfiguration(
          state.studyGoals,
          state.dailyGoalMinutes,
        ),
        studyWeekdays: [...new Set(studyWeekdays)],
        maxDailyMinutes,
      }
    },
    setNotification(state, action: PayloadAction<NotificationSettingState>) {
      state.notification = action.payload

      const notificationStorage = {
        [ChromeKeys.CHROME_STATE_NOTIFICATION]: action.payload || {
          isNotificationActive: true,
          periodInMinutes: 60,
        },
      }

      chrome.storage.local.set(notificationStorage, () => {
        console.log(action.payload.isNotificationActive)
      })
    },
  },
})

export default settingSlice.reducer
