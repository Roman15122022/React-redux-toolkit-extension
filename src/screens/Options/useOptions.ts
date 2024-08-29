import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { SelectChangeEvent } from '@mui/material'
import { settingSlice } from '../../store/reducers/settingReducer/SettingSlice'
import { Language, ThemeVariants } from '../../types/enums'
import React from 'react'
import useTheme from '../../hooks/useTheme'

export const useOptions = () => {
  const { count } = useAppSelector(state => state.ClickerReducer)
  const { language, theme } = useAppSelector(state => state.SettingReducer)

  const { setLocale, toggleTheme } = settingSlice.actions
  const dispatch = useAppDispatch()

  useTheme()

  function handleSelectLocale(event: SelectChangeEvent): void {
    dispatch(setLocale(event.target.value as Language))
  }

  function switchTheme(event: React.ChangeEvent<HTMLInputElement>): void {
    const isChecked = event.target.checked
    const theme = isChecked ? ThemeVariants.DARK : ThemeVariants.LIGHT

    dispatch(toggleTheme(theme))
  }

  return {
    count,
    handleSelectLocale,
    language,
    isDark: theme === ThemeVariants.DARK,
    switchTheme,
  }
}
