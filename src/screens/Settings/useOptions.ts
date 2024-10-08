import { SelectChangeEvent } from '@mui/material'

import { Language, ThemeVariants } from '../../types'
import { useTranslate } from '../../hooks/useTranslate'
import useTheme from '../../hooks/useTheme'

export const useOptions = () => {
  const { handleChangeTheme, theme } = useTheme()
  const { language, interfaceLang, handleChangeLocale } = useTranslate()

  function handleSelectLocale(event: SelectChangeEvent): void {
    const language = event.target.value as Language
    handleChangeLocale(language)
  }

  function switchTheme(): void {
    const newTheme =
      theme === ThemeVariants.LIGHT ? ThemeVariants.DARK : ThemeVariants.LIGHT

    handleChangeTheme(newTheme)
  }

  return {
    interfaceLang,
    handleSelectLocale,
    language,
    isDark: theme === ThemeVariants.DARK,
    switchTheme,
  }
}
