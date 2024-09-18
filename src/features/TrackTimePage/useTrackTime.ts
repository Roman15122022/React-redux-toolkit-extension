import { useEffect, useLayoutEffect, useState } from 'react'

import { getDayOfWeekNumber, getTimeDifferenceByNow } from '../../utils'
import { timerLogsSlice } from '../../store/reducers/timeLogsReducer/TimerLogsSlice'
import { currentTimerSlice } from '../../store/reducers/currentTimerReducer/CurrentTimerSlice'
import { useTranslate } from '../../hooks/useTranslate'
import useTimer from '../../hooks/useTimer'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { TIME_IN_MS } from '../../constants'

import { customizedTime, formatTime } from './helpers'

export const useTrackTime = () => {
  const { interfaceLang } = useTranslate()

  const [lastTime, setLastTime] = useState<string>('')

  const {
    stateTimer: storeStateTimer,
    startDate,
    elapsedTime,
  } = useAppSelector(state => state.CurrentTimerReducer)
  const { lastStartDate } = useAppSelector(state => state.TimerLogsReducer)

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
    const dateS = new Date(2024, 8, 14, 13, 0, 0)
    const dateE = new Date(2024, 8, 14, 15, 0, 0)
    dispatch(
      addTimeLogs({
        activityName: '',
        startDate: lastStartDate,
        endDate: Date.now(),
        dayOfWeek: getDayOfWeekNumber(),
        totalTimeForSession: elapsedTime,
      }),
    )

    dispatch(setStartDate(0))
    dispatch(setElapsedTime(0))
    dispatch(setStateTimer(null))

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
  }
}
