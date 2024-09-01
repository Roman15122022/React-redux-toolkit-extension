import { useAppSelector } from '../../hooks/useAppSelector'
import { SelectChangeEvent } from '@mui/material'
import { Language, ThemeVariants } from '../../types/enums'
import React from 'react'
import useTheme from '../../hooks/useTheme'
import { useTranslate } from '../../hooks/useTranslate'

export const useOptions = () => {
  const { handleChangeTheme, theme } = useTheme()
  const { language, interfaceLang, handleChangeLocale } = useTranslate()

  function handleSelectLocale(event: SelectChangeEvent): void {
    const language = event.target.value as Language
    handleChangeLocale(language)
  }

  function switchTheme(event: React.ChangeEvent<HTMLInputElement>): void {
    const isChecked = event.target.checked
    const theme = isChecked ? ThemeVariants.DARK : ThemeVariants.LIGHT

    handleChangeTheme(theme)
  }

  return {
    interfaceLang,
    handleSelectLocale,
    language,
    isDark: theme === ThemeVariants.DARK,
    switchTheme,
  }
}
