import { useLayoutEffect } from 'react'

import { currentTimerSlice } from '../../store/reducers/currentTimerReducer/CurrentTimerSlice'
import { useTranslate } from '../../hooks/useTranslate'
import useTimer from '../../hooks/useTimer'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'

import { formatTime, getTimeDifferenceByNow } from './helpers'

export const useTrackTime = () => {
  const { interfaceLang } = useTranslate()

  const {
    stateTimer: storeStateTimer,
    startDate,
    elapsedTime,
  } = useAppSelector(state => state.CurrentTimerReducer)
  const { setStateTimer, setStartDate, setElapsedTime } =
    currentTimerSlice.actions
  const dispatch = useAppDispatch()

  const { seconds, stateTimer, pauseTimer, stopTimer, startTimer } = useTimer(
    getTimeDifferenceByNow(startDate),
    elapsedTime,
    storeStateTimer,
  )

  function handleStopTimer(): void {
    stopTimer()
    dispatch(setStartDate(0))
    dispatch(setElapsedTime(0))
    dispatch(setStateTimer(null))
  }

  function handleStartTimer(): void {
    const now = new Date().getTime()
    dispatch(setStartDate(now))
    startTimer()
  }

  function handlePauseTimer(): void {
    pauseTimer()
    dispatch(setStateTimer(stateTimer))
    dispatch(setElapsedTime(seconds))
  }

  useLayoutEffect(() => {
    if (!startDate || storeStateTimer?.isPause) return

    startTimer()
  }, [])

  return {
    locale: interfaceLang.popup.track,
    time: formatTime(seconds),
    handleStartTimer,
    handleStopTimer,
    handlePauseTimer,
    startTimer,
    isPaused: stateTimer.isPause,
    isActive: stateTimer.isActive,
  }
}
