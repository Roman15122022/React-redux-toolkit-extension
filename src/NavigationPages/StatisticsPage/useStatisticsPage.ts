import { useState } from 'react'

import { useTranslate } from '../../hooks/useTranslate'
import { useStateSaver } from '../../hooks/useStateSaver'
import { useAppSelector } from '../../hooks/useAppSelector'

export const useStatisticsPage = () => {
  const { dates } = useAppSelector(state => state.TimerLogsReducer)
  const { isHintActive: startValueHint } = useAppSelector(
    state => state.StateSaverReducer,
  )

  const { interfaceLang } = useTranslate()
  const { setIsActiveHint } = useStateSaver()

  const [isHintActive, setIsHintActive] = useState<boolean>(
    startValueHint ?? false,
  )

  const handleToggleHint = (): void => {
    setIsHintActive(prevState => {
      setIsActiveHint(!prevState)

      return !prevState
    })
  }

  return {
    locale: interfaceLang.popup.statistics,
    isDataAvailable: dates.length > 0,
    isHintActive,
    colorHint: isHintActive ? 'text-secondary-light dark:text-purple-dark' : '',
    handleToggleHint,
    dates,
  }
}
