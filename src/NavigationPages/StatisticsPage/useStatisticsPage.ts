import { useState } from 'react'

import { useTranslate } from '../../hooks/useTranslate'
import { useAppSelector } from '../../hooks/useAppSelector'

export const useStatisticsPage = () => {
  const { dates } = useAppSelector(state => state.TimerLogsReducer)

  const { interfaceLang } = useTranslate()

  const [isHintActive, setIsHintActive] = useState<boolean>(false)

  const handleToggleHint = (): void => {
    setIsHintActive(prevState => !prevState)
  }

  return {
    locale: interfaceLang.popup.statistics,
    isDataAvailable: dates.length > 0,
    isHintActive,
    colorHint: isHintActive ? 'text-secondary-light dark:text-purple-dark' : '',
    handleToggleHint,
  }
}
