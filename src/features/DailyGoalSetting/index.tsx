import { useEffect, useState } from 'react'
import React from 'react'
import DoneIcon from '@mui/icons-material/Done'
import ClearIcon from '@mui/icons-material/Clear'

import { TypeButton } from '../../types'
import { settingSlice } from '../../store/reducers/settingReducer/SettingSlice'
import { useTranslate } from '../../hooks/useTranslate'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import Button from '../../components/Button'

const DailyGoalSetting = (): JSX.Element => {
  const { interfaceLang } = useTranslate()
  const goalMinutes = useAppSelector(
    state => state.SettingReducer.dailyGoalMinutes ?? 60,
  )
  const dispatch = useAppDispatch()
  const [draftMinutes, setDraftMinutes] = useState(String(goalMinutes))
  const [isEditing, setIsEditing] = useState(false)
  const parsedMinutes = Number(draftMinutes)
  const isValid =
    Number.isInteger(parsedMinutes) &&
    parsedMinutes >= 1 &&
    parsedMinutes <= 1440

  useEffect(() => setDraftMinutes(String(goalMinutes)), [goalMinutes])

  function saveGoal(): void {
    if (!isValid) return

    dispatch(settingSlice.actions.setDailyGoalMinutes(parsedMinutes))
    setIsEditing(false)
  }

  function cancelEditing(): void {
    setDraftMinutes(String(goalMinutes))
    setIsEditing(false)
  }

  return (
    <div className="theme-text my-4 flex flex-wrap items-center justify-between gap-3">
      <span id="daily-goal-label" className="theme-text text-lg font-semibold">
        {interfaceLang.settings.dailyGoal}
      </span>
      {isEditing ? (
        <div className="relative flex items-center gap-3">
          <input
            id="daily-goal-minutes"
            aria-labelledby="daily-goal-label"
            autoFocus
            type="number"
            min={1}
            max={1440}
            step={1}
            value={draftMinutes}
            onChange={event => setDraftMinutes(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter') saveGoal()

              if (event.key === 'Escape') cancelEditing()
            }}
            aria-invalid={!isValid}
            aria-describedby={!isValid ? 'daily-goal-error' : undefined}
            className="theme-text w-24 rounded-md border border-purple-light bg-white px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-light dark:bg-black"
          />
          <Button
            onClick={cancelEditing}
            variant={TypeButton.PRIMARY}
            classes="px-2 py-1"
          >
            <ClearIcon
              titleAccess={interfaceLang.popup.track.cancel}
              sx={{ fontSize: 13 }}
            />
          </Button>
          <Button
            onClick={saveGoal}
            disabled={!isValid}
            variant={TypeButton.SECONDARY}
            classes="px-2 py-1"
          >
            <DoneIcon
              titleAccess={interfaceLang.settings.dailyGoalSave}
              sx={{ fontSize: 13 }}
            />
          </Button>
          {!isValid && (
            <p
              id="daily-goal-error"
              className="absolute right-0 top-full mt-1 text-xs text-red-600"
            >
              {interfaceLang.settings.dailyGoalError}
            </p>
          )}
        </div>
      ) : (
        <Button onClick={() => setIsEditing(true)}>
          {goalMinutes} {interfaceLang.settings.notification.minutes}
        </Button>
      )}
    </div>
  )
}

export default DailyGoalSetting
