import { SyntheticEvent, useEffect, useLayoutEffect, useState } from 'react'

import { trainAIModelAfterSession } from '../AIHelper/aiModel'
import { getDayOfWeekNumber, getTimeDifferenceByNow } from '../../utils'
import { SessionsDomainInfo, TimePeriod } from '../../types'
import { timerLogsSlice } from '../../store/reducers/timeLogsReducer/TimerLogsSlice'
import { currentTimerSlice } from '../../store/reducers/currentTimerReducer/CurrentTimerSlice'
import { useTranslate } from '../../hooks/useTranslate'
import useTimer from '../../hooks/useTimer'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import {
  createSessionSummary,
  getSessionDomainData,
} from '../../features/SessionSummary/helpers'
import {
  CANCEL_TIMER_SESSION_MESSAGE,
  FINISH_TIMER_SESSION_MESSAGE,
  TIME_IN_MS,
} from '../../constants'

import { customizedTime, formatTime } from './helpers'

export const useTrackTime = () => {
  const { interfaceLang } = useTranslate()

  const {
    stateTimer: storeStateTimer,
    startDate,
    elapsedTime,
    pauseCount = 0,
  } = useAppSelector(state => state.CurrentTimerReducer)
  const { dates, lastStartDate, lastNameActivity, lastMood } = useAppSelector(
    state => state.TimerLogsReducer,
  )
  const distractingDomains = useAppSelector(
    state => state.SessionDataSlice.distractingDomains || [],
  )

  const [lastTime, setLastTime] = useState<string>('')
  const [mood, setMood] = useState<string>(lastMood || '3')
  const [inputText, setInputText] = useState<string>('')
  const [isError, setIsError] = useState<boolean>(false)
  const [completedSession, setCompletedSession] = useState<TimePeriod | null>(
    null,
  )

  const {
    incrementPauseCount,
    resetCurrentTimer: resetCurrentTimerState,
    setStateTimer,
    setStartDate,
    setElapsedTime,
  } = currentTimerSlice.actions
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
      const startTimeRandom = Math.floor(Math.random() * (19 - 9 + 1)) + 9
      const randomMonth = Math.floor(Math.random() * (12 - 1 + 1)) + 1

      const dateS = new Date(2024, i, randomMonth, startTimeRandom, 0, 0)
      const dateE = new Date(2024, i, randomMonth, startTimeRandom + 3, 0, 0)
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

  function resetCurrentTimer(): void {
    dispatch(setStateTimer({ isActive: false, isPause: false }))
    dispatch(resetCurrentTimerState())

    stopAndResetTimer()
    setInputText('')
  }

  function finishDomainSession(): Promise<SessionsDomainInfo[]> {
    return new Promise(resolve => {
      chrome.runtime.sendMessage(
        { type: FINISH_TIMER_SESSION_MESSAGE },
        (response?: { sessions?: SessionsDomainInfo[] }) => {
          resolve(response?.sessions || [])
        },
      )
    })
  }

  async function handleStopTimer(): Promise<void> {
    const domainSessions = await finishDomainSession()
    const timeLog: TimePeriod = {
      activityName: lastNameActivity.trim(),
      startDate: lastStartDate,
      endDate: Date.now(),
      dayOfWeek: getDayOfWeekNumber(),
      totalTimeForSession: seconds,
      mood: lastMood,
      pauseCount,
    }
    const sessionDomainData = getSessionDomainData(timeLog, domainSessions)
    const summary = createSessionSummary({
      session: timeLog,
      history: dates,
      domainSessions: sessionDomainData,
      distractingDomains,
    })
    const completedTimeLog: TimePeriod = {
      ...timeLog,
      domainSessions: sessionDomainData,
      focusScore: summary.focusScore,
    }

    dispatch(addTimeLogs(completedTimeLog))
    void trainAIModelAfterSession([...dates, completedTimeLog]).catch(
      () => undefined,
    )

    resetCurrentTimer()
    setLastTime(customizedTime(formatTime(seconds), interfaceLang))
    setCompletedSession(completedTimeLog)
  }

  function handleCancelTimer(): void {
    chrome.runtime.sendMessage({ type: CANCEL_TIMER_SESSION_MESSAGE }, () => {
      resetCurrentTimer()
      setLastTime('')
    })
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
    setCompletedSession(null)
    handleStartTimer()
  }

  function handlePauseTimer(): void {
    dispatch(setStateTimer({ isActive: true, isPause: true }))
    dispatch(setElapsedTime(seconds))
    dispatch(incrementPauseCount())

    pauseTimer()
  }

  function handleChangeMood(newMood: string): void {
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
    handleCancelTimer,
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
    completedSession,
    handleCloseSessionSummary: () => setCompletedSession(null),
  }
}
