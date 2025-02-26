import { useState, useMemo } from 'react'
import { SelectChangeEvent } from '@mui/material'

import { useTranslate } from '../../hooks/useTranslate'
import { useStateSaver } from '../../hooks/useStateSaver'
import { useAppSelector } from '../../hooks/useAppSelector'

import { Period } from './types'
import { getDatesByPeriod } from './helpers'

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
  const [period, setPeriod] = useState<Period>('0')

  const handleToggleHint = (): void => {
    setIsHintActive(prevState => {
      setIsActiveHint(!prevState)

      return !prevState
    })
  }

  const handleChangePeriod = (event: SelectChangeEvent) => {
    setPeriod(event.target.value as Period)
  }

  const dataByPeriod = useMemo(() => {
    return getDatesByPeriod(dates, period)
  }, [dates, period])

  return {
    locale: interfaceLang.popup.statistics,
    isDataAvailable: dates.length > 0,
    isHintActive,
    colorHint: isHintActive ? 'text-secondary-light dark:text-purple-dark' : '',
    handleToggleHint,
    dates: dataByPeriod,
    period,
    handleChangePeriod,
  }
}
