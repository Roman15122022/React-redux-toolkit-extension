import { SyntheticEvent, useEffect, useLayoutEffect, useState } from 'react'
import { SelectChangeEvent } from '@mui/material'

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

  const {
    stateTimer: storeStateTimer,
    startDate,
    elapsedTime,
  } = useAppSelector(state => state.CurrentTimerReducer)
  const { lastStartDate, lastNameActivity, lastMood } = useAppSelector(
    state => state.TimerLogsReducer,
  )

  const [lastTime, setLastTime] = useState<string>('')
  const [mood, setMood] = useState<string>(lastMood || '3')
  const [inputText, setInputText] = useState<string>('')
  const [isError, setIsError] = useState<boolean>(false)

  const { setStateTimer, setStartDate, setElapsedTime } =
    currentTimerSlice.actions
  const { setLastNameActivity, setLastStartDate, addTimeLogs, setLastMood } =
    timerLogsSlice.actions

  const dispatch = useAppDispatch()

  const {
    seconds,
    stateTimer,
    pauseTimer,
    stopAndResetTimer,
    startTimer,
    initializeTimer,
  } = useTimer(getTimeDifferenceByNow(startDate), elapsedTime, storeStateTimer)

  //function for test

  /*const test = (): void => {
    const moodUser = Math.ceil(Math.random() * 5)

    for (let i = 0; i <= 5; i++) {
      const dateS = new Date(2024, i, 10, 13, 0, 0)
      const dateE = new Date(2024, i, 10, 15, 0, 0)
      dispatch(
        addTimeLogs({
          activityName: i % 2 === 0 ? 'Programming' : 'English',
          startDate: dateS.getTime(),
          endDate: dateE.getTime(),
          dayOfWeek: getDayOfWeekNumber(),
          totalTimeForSession: 7200 + i * 32 * moodUser,
          mood: moodUser.toString(),
        }),
      )
    }
  }*/
  const handleOnChanges = (_event: SyntheticEvent, value: string) => {
    setInputText(value)
    setIsError(false)
  }

  function handleStopTimer(): void {
    dispatch(
      addTimeLogs({
        activityName: lastNameActivity.trim(),
        startDate: lastStartDate,
        endDate: Date.now(),
        dayOfWeek: getDayOfWeekNumber(),
        totalTimeForSession: elapsedTime,
        mood: lastMood,
      }),
    )

    dispatch(setStartDate(0))
    dispatch(setElapsedTime(0))
    dispatch(setStateTimer(null))

    stopAndResetTimer()

    setLastTime(customizedTime(formatTime(seconds), interfaceLang))
    setInputText('')
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
    if (!inputText.trim()) {
      setIsError(true)

      return
    }

    const now = Date.now()
    dispatch(setStartDate(now))
    dispatch(setLastStartDate(now))
    dispatch(setLastNameActivity(inputText))
    dispatch(setLastMood(mood))

    setLastTime('')
    handleStartTimer()
  }

  function handlePauseTimer(): void {
    dispatch(setStateTimer({ isActive: true, isPause: true }))
    dispatch(setElapsedTime(seconds))

    pauseTimer()
  }

  function handleChangeMood(event: SelectChangeEvent) {
    const newMood = event.target.value

    setMood(newMood)
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
    lastNameActivity,
    date: Date.now(),
    handleOnChanges,
    isError,
    currentLength: inputText.length,
    mood,
    handleChangeMood,
  }
}
