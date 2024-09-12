import { useState } from 'react'

import { timerLogsSlice } from '../../store/reducers/timeLogsReducer/TimerLogsSlice'
import { useTranslate } from '../../hooks/useTranslate'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'

export const useResetStatistics = () => {
  const { interfaceLang } = useTranslate()

  const { dates } = useAppSelector(state => state.TimerLogsReducer)
  const { resetData } = timerLogsSlice.actions
  const dispatch = useAppDispatch()

  const [isBtnActive, setIsBtnActive] = useState<boolean>(false)
  const [isReset, setIsReset] = useState<boolean>(false)

  function handleToggleButtons(): void {
    setIsBtnActive(prevState => !prevState)
  }

  function resetStatistics(): void {
    dispatch(resetData())

    setIsBtnActive(false)
    setIsReset(true)
  }

  return {
    locale: interfaceLang.settings.resetStatistics,
    isBtnActive,
    isReset,
    isDisabled: !dates.length,
    handleToggleButtons,
    resetStatistics,
  }
}
