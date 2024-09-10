import { useEffect, useLayoutEffect, useState } from 'react'

import { timerLogsSlice } from '../../store/reducers/timeLogsReducer/TimerLogsSlice'
import { currentTimerSlice } from '../../store/reducers/currentTimerReducer/CurrentTimerSlice'
import { useTranslate } from '../../hooks/useTranslate'
import useTimer from '../../hooks/useTimer'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { TIME_IN_MS } from '../../constants'

import {
  customizedPeriod,
  customizedTime,
  formatTime,
  getDayOfWeekNumber,
  getTimeDifferenceByNow,
} from './helpers'

export const useTrackTime = () => {
  const { interfaceLang, language } = useTranslate()

  const [lastTime, setLastTime] = useState<string>('')

  const {
    stateTimer: storeStateTimer,
    startDate,
    elapsedTime,
  } = useAppSelector(state => state.CurrentTimerReducer)
  const { dates, lastStartDate } = useAppSelector(
    state => state.TimerLogsReducer,
  )

  const { setStateTimer, setStartDate, setElapsedTime } =
    currentTimerSlice.actions
  const { setLastStartDate, addTimeLogs } = timerLogsSlice.actions

  const dispatch = useAppDispatch()

  const {
    seconds,
    stateTimer,
    pauseTimer,
    stopAndResetTimer,
    startTimer,
    initializeTimer,
  } = useTimer(getTimeDifferenceByNow(startDate), elapsedTime, storeStateTimer)

  function handleStopTimer(): void {
    dispatch(setStartDate(0))
    dispatch(setElapsedTime(0))
    dispatch(setStateTimer(null))
    dispatch(
      addTimeLogs({
        startDate: lastStartDate,
        endDate: Date.now(),
        dayOfWeek: getDayOfWeekNumber(),
      }),
    )
    stopAndResetTimer()

    setLastTime(customizedTime(formatTime(seconds), interfaceLang))
  }

  function handleStartTimer(): void {
    dispatch(setStateTimer({ isActive: true, isPause: false }))
    startTimer()
  }

  function handleStartFromButton(): void {
    const newDate = Date.now() - seconds * TIME_IN_MS.SECOND
    dispatch(setStartDate(newDate))

    handleStartTimer()
  }

  function handleStartSession(): void {
    const now = Date.now()
    dispatch(setStartDate(now))
    dispatch(setLastStartDate(now))

    setLastTime('')
    handleStartTimer()
  }

  function handlePauseTimer(): void {
    dispatch(setStateTimer({ isActive: true, isPause: true }))
    dispatch(setElapsedTime(seconds))

    pauseTimer()
  }

  useLayoutEffect(() => {
    if (!startDate) return

    if (storeStateTimer.isPause) {
      initializeTimer()

      return
    }

    handleStartTimer()
  }, [])

  useEffect(() => {
    dispatch(setElapsedTime(seconds))
  }, [seconds])

  return {
    locale: interfaceLang.popup.track,
    time: formatTime(seconds),
    handleStartSession,
    handleStopTimer,
    handlePauseTimer,
    startTimer,
    isPaused: stateTimer.isPause,
    isActive: stateTimer.isActive,
    handleStartFromButton,
    lastTime,
    period: customizedPeriod(dates, language),
  }
}
