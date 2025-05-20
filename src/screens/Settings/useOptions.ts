import { useLayoutEffect, useState } from 'react'
import { SelectChangeEvent } from '@mui/material'

import { Language, ThemeVariants } from '../../types'
import { useTranslate } from '../../hooks/useTranslate'
import useTheme from '../../hooks/useTheme'
import { useManageBlackListDomain } from '../../hooks/useManageBlackListDomain'

export const useOptions = () => {
  const { handleChangeTheme, theme } = useTheme()
  const { language, interfaceLang, handleChangeLocale } = useTranslate()
  const { handleSetBlackList } = useManageBlackListDomain()

  const urlParams = new URLSearchParams(window.location.search)
  const blacklistParam = urlParams.get('blacklist')

  const [isBlackList, setIsBlackList] = useState(blacklistParam === 'true')

  function handleSelectLocale(event: SelectChangeEvent): void {
    const language = event.target.value as Language
    handleChangeLocale(language)
  }

  function switchTheme(): void {
    const newTheme =
      theme === ThemeVariants.LIGHT ? ThemeVariants.DARK : ThemeVariants.LIGHT

    handleChangeTheme(newTheme)
  }

  function toggleBlackList(): void {
    setIsBlackList(prevState => {
      const newValue = !prevState

      const urlParams = new URLSearchParams(window.location.search)
      urlParams.set('blacklist', `${newValue}`)

      const newUrl = `${window.location.pathname}?${urlParams.toString()}`
      window.history.pushState({}, '', newUrl)

      return newValue
    })
  }

  useLayoutEffect(() => {
    handleSetBlackList()
  }, [])

  return {
    interfaceLang,
    handleSelectLocale,
    language,
    isDark: theme === ThemeVariants.DARK,
    switchTheme,
    isBlackList,
    toggleBlackList,
    title: isBlackList
      ? `${interfaceLang.settings.titleTwo}📝`
      : `${interfaceLang.settings.title}👨‍🎓`,
  }
}
