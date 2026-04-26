import React from 'react'

import { cn } from '../../utils'
import { useTranslate } from '../../hooks/useTranslate'
import useTheme from '../../hooks/useTheme'

import { MoodSelectOptions } from './types'
import {
  MOOD_SELECTED_BG_ALPHA,
  MOOD_SELECTED_SHADOW_ALPHA,
  MOOD_SELECT_ICON_SIZE,
  MoodIcons,
  MoodLabelKeys,
  MoodSelectClasses,
  MoodSelectThemeStyles,
  MoodColorDictionary,
} from './constants'

export const MoodSelect = ({
  value,
  onChange,
}: MoodSelectOptions): JSX.Element => {
  const { interfaceLang } = useTranslate()
  const { theme } = useTheme()
  const moodLabels = interfaceLang.popup.statistics.moods
  const themeStyles = MoodSelectThemeStyles[theme]
  const selectedMoodLabel =
    moodLabels[MoodLabelKeys[Number(value) as keyof typeof MoodIcons]]

  return (
    <div className={MoodSelectClasses.root}>
      <div
        className={cn(...MoodSelectClasses.pill)}
        style={{
          backgroundColor: themeStyles.pillBackground,
          borderColor: themeStyles.pillBorder,
          boxShadow: themeStyles.pillShadow,
        }}
        role="radiogroup"
        aria-label="Mood"
      >
        {Object.entries(MoodIcons).map(([moodValue, Icon]) => {
          const isSelected = moodValue === value
          const moodNumber = Number(moodValue) as keyof typeof MoodIcons
          const label = moodLabels[MoodLabelKeys[moodNumber]]
          const selectedColor = MoodColorDictionary[moodNumber][theme]

          return (
            <button
              key={moodValue}
              type="button"
              title={label}
              aria-label={label}
              aria-checked={isSelected}
              role="radio"
              onClick={() => onChange(moodValue)}
              className={cn(
                ...MoodSelectClasses.buttonBase,
                isSelected
                  ? MoodSelectClasses.selectedButton
                  : MoodSelectClasses.button,
              )}
              style={{
                borderColor: isSelected
                  ? themeStyles.selectedBorder
                  : 'transparent',
                backgroundColor: isSelected
                  ? `${selectedColor}${MOOD_SELECTED_BG_ALPHA}`
                  : 'transparent',
                boxShadow: isSelected
                  ? `inset 0 0 0 1px ${themeStyles.selectedRing}, 0 0 8px ${selectedColor}${MOOD_SELECTED_SHADOW_ALPHA}`
                  : undefined,
              }}
            >
              <Icon
                htmlColor={selectedColor}
                sx={{
                  fontSize: isSelected
                    ? MOOD_SELECT_ICON_SIZE.selected
                    : MOOD_SELECT_ICON_SIZE.default,
                }}
              />
            </button>
          )
        })}
      </div>
      <div className={MoodSelectClasses.label}>
        {interfaceLang.popup.track.currentMood}:{' '}
        <span className={MoodSelectClasses.labelValue}>
          {selectedMoodLabel}
        </span>
      </div>
    </div>
  )
}
