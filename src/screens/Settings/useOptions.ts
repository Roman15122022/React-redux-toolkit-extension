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
  const historyParam = urlParams.get('history')

  const [isBlackList, setIsBlackList] = useState(blacklistParam === 'true')
  const [isHistory, setIsHistory] = useState(historyParam === 'true')

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
      urlParams.delete('history')
      urlParams.delete('period')

      const newUrl = `${window.location.pathname}?${urlParams.toString()}`
      window.history.pushState({}, '', newUrl)
      setIsHistory(false)

      return newValue
    })
  }

  function toggleHistory(): void {
    setIsHistory(prevState => {
      const newValue = !prevState

      const urlParams = new URLSearchParams(window.location.search)
      urlParams.set('history', `${newValue}`)
      urlParams.delete('blacklist')

      if (!newValue) urlParams.delete('period')

      const newUrl = `${window.location.pathname}?${urlParams.toString()}`
      window.history.pushState({}, '', newUrl)
      setIsBlackList(false)

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
    isHistory,
    toggleBlackList,
    toggleHistory,
    title: isBlackList
      ? `${interfaceLang.settings.titleTwo}📝`
      : isHistory
        ? interfaceLang.popup.header.history
        : `${interfaceLang.settings.title}👨‍🎓`,
  }
}
