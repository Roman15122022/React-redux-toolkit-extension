import { SyntheticEvent, useEffect, useRef, useState } from 'react'

import { trainAIModelAfterSession } from '../AIHelper/aiModel'
import { getDayOfWeekNumber } from '../../utils'
import { SessionsDomainInfo, TimePeriod } from '../../types'
import { timerLogsSlice } from '../../store/reducers/timeLogsReducer/TimerLogsSlice'
import { currentTimerSlice } from '../../store/reducers/currentTimerReducer/CurrentTimerSlice'
import { store } from '../../store'
import { useTranslate } from '../../hooks/useTranslate'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { getCompletedGoalIds } from '../../features/StudyGoals/milestones'
import { getStudyGoalProgress } from '../../features/StudyGoals/helpers'
import { getGoalLabel } from '../../features/StudyGoals/GoalProgress'
import { normalizeStudyGoalsConfiguration } from '../../features/StudyGoals/configuration'
import {
  SessionConfiguration,
  SessionTemplate,
} from '../../features/SessionTemplates/types'
import {
  getTemplateError,
  getSessionConfiguration,
} from '../../features/SessionTemplates/helpers'
import {
  createSessionSummary,
  getSessionDomainData,
} from '../../features/SessionSummary/helpers'
import {
  CANCEL_TIMER_SESSION_MESSAGE,
  FINISH_TIMER_SESSION_MESSAGE,
} from '../../constants'

import { getElapsedSeconds, getResumeStartDate } from './timerState'
import { customizedTime, formatTime } from './helpers'

export const useTrackTime = () => {
  const { interfaceLang } = useTranslate()
  const timer = useAppSelector(state => state.CurrentTimerReducer)
  const { dates, lastStartDate, lastNameActivity, lastMood } = useAppSelector(
    state => state.TimerLogsReducer,
  )
  const distractingDomains = useAppSelector(
    state => state.SessionDataSlice.distractingDomains || [],
  )
  const startingTemplate = useRef(false)
  const [isStartingTemplate, setIsStartingTemplate] = useState(false)
  const [templateStartError, setTemplateStartError] = useState<
    'invalid' | 'startError' | null
  >(null)
  const [now, setNow] = useState(Date.now())
  const [lastTime, setLastTime] = useState('')
  const [mood, setMood] = useState(lastMood || '3')
  const [inputText, setInputText] = useState('')
  const [isError, setIsError] = useState(false)
  const [isFinishing, setIsFinishing] = useState(false)
  const [completedGoalNames, setCompletedGoalNames] = useState<string[]>([])
  const [completedSession, setCompletedSession] = useState<TimePeriod | null>(
    null,
  )
  const dispatch = useAppDispatch()
  const isActive = timer.stateTimer?.isActive ?? false
  const isPaused = timer.stateTimer?.isPause ?? false
  const seconds = getElapsedSeconds(timer, now)

  useEffect(() => {
    setNow(Date.now())
    const interval = window.setInterval(
      () => setNow(Date.now()),
      isActive && !isPaused ? 1000 : 60_000,
    )

    return () => window.clearInterval(interval)
  }, [isActive, isPaused, timer.startDate])

  const handleOnChanges = (_event: SyntheticEvent, value: string) => {
    setInputText(value)
    setIsError(false)
  }

  function resetCurrentTimer(): void {
    dispatch(
      currentTimerSlice.actions.setStateTimer({
        isActive: false,
        isPause: false,
      }),
    )
    dispatch(currentTimerSlice.actions.resetCurrentTimer())
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
    if (!isActive || isFinishing) return

    setIsFinishing(true)
    const endDate = Date.now()
    const completedSeconds = getElapsedSeconds(timer, endDate)

    try {
      const domainSessions = await finishDomainSession()
      const timeLog: TimePeriod = {
        activityName: lastNameActivity.trim(),
        startDate: lastStartDate,
        endDate,
        dayOfWeek: getDayOfWeekNumber(),
        totalTimeForSession: completedSeconds,
        mood: lastMood,
        note: timer.note?.trim() || '',
        pauseCount: timer.pauseCount || 0,
        ...(timer.sessionConfiguration
          ? { sessionConfiguration: timer.sessionConfiguration }
          : {}),
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

      const currentState = store.getState()
      const currentSessions = currentState.TimerLogsReducer.dates
      const goalConfiguration = normalizeStudyGoalsConfiguration(
        currentState.SettingReducer.studyGoals,
        currentState.SettingReducer.dailyGoalMinutes,
      )
      const beforeProgress = getStudyGoalProgress(
        currentSessions,
        goalConfiguration,
        endDate,
      )
      const afterProgress = getStudyGoalProgress(
        [...currentSessions, completedTimeLog],
        goalConfiguration,
        endDate,
      )
      const completedGoalIds = getCompletedGoalIds(
        beforeProgress,
        afterProgress,
      )
      setCompletedGoalNames(
        goalConfiguration.goals
          .filter(goal => completedGoalIds.includes(goal.id))
          .map(goal => getGoalLabel(goal, interfaceLang.studyGoals)),
      )

      dispatch(timerLogsSlice.actions.addTimeLogs(completedTimeLog))
      void trainAIModelAfterSession([...dates, completedTimeLog]).catch(
        () => undefined,
      )
      resetCurrentTimer()
      setNow(Date.now())
      setLastTime(customizedTime(formatTime(completedSeconds), interfaceLang))
      setCompletedSession(completedTimeLog)
    } finally {
      setIsFinishing(false)
    }
  }

  function handleCancelTimer(): void {
    if (!isActive || isFinishing) return

    chrome.runtime.sendMessage({ type: CANCEL_TIMER_SESSION_MESSAGE }, () => {
      resetCurrentTimer()
      setNow(Date.now())
      setLastTime('')
    })
  }

  function handleStartFromButton(): void {
    const resumedAt = Date.now()
    dispatch(
      currentTimerSlice.actions.setStartDate(
        getResumeStartDate(resumedAt, seconds),
      ),
    )
    dispatch(
      currentTimerSlice.actions.setStateTimer({
        isActive: true,
        isPause: false,
      }),
    )
    setNow(resumedAt)
  }

  function startSession(
    activityName: string,
    initialMood: string,
    configuration: SessionConfiguration | null = null,
  ): boolean {
    if (
      store.getState().CurrentTimerReducer.stateTimer?.isActive ||
      isFinishing
    )
      return false

    if (!activityName.trim()) {
      setIsError(true)

      return false
    }

    const startedAt = Date.now()
    dispatch(currentTimerSlice.actions.resetCurrentTimer())
    dispatch(currentTimerSlice.actions.setSessionConfiguration(configuration))
    dispatch(currentTimerSlice.actions.setStartDate(startedAt))
    dispatch(currentTimerSlice.actions.setElapsedTime(0))
    dispatch(timerLogsSlice.actions.setLastStartDate(startedAt))
    dispatch(timerLogsSlice.actions.setLastNameActivity(activityName.trim()))
    dispatch(timerLogsSlice.actions.setLastMood(initialMood))
    dispatch(
      currentTimerSlice.actions.setStateTimer({
        isActive: true,
        isPause: false,
      }),
    )
    setNow(startedAt)
    setLastTime('')
    setCompletedSession(null)
    setCompletedGoalNames([])
    setTemplateStartError(null)

    return true
  }

  function handleStartSession(): void {
    if (startingTemplate.current) return

    startSession(inputText, mood)
  }

  async function handleStartTemplate(
    template: SessionTemplate,
  ): Promise<boolean> {
    if (
      startingTemplate.current ||
      store.getState().CurrentTimerReducer.stateTimer?.isActive
    )
      return false

    if (getTemplateError(template, [])) {
      setTemplateStartError('invalid')

      return false
    }

    startingTemplate.current = true
    setIsStartingTemplate(true)
    setTemplateStartError(null)
    try {
      const storageData = await chrome.storage.local.get('blackList')
      const availableDomains = Array.isArray(storageData.blackList)
        ? storageData.blackList.filter(
            (domain: unknown): domain is string => typeof domain === 'string',
          )
        : []

      return startSession(
        template.activityName,
        template.mood,
        getSessionConfiguration(template, availableDomains),
      )
    } catch {
      setTemplateStartError('startError')

      return false
    } finally {
      startingTemplate.current = false
      setIsStartingTemplate(false)
    }
  }

  function handlePauseTimer(): void {
    if (!isActive || isPaused) return

    dispatch(currentTimerSlice.actions.setElapsedTime(seconds))
    dispatch(currentTimerSlice.actions.incrementPauseCount())
    dispatch(
      currentTimerSlice.actions.setStateTimer({
        isActive: true,
        isPause: true,
      }),
    )
  }

  return {
    locale: interfaceLang.popup.track,
    time: formatTime(seconds),
    seconds,
    handleStartSession,
    handleStartTemplate,
    isStartingTemplate,
    templateStartError,
    sessionConfiguration: timer.sessionConfiguration,
    handleStopTimer,
    handleCancelTimer,
    handlePauseTimer,
    isPaused,
    isActive,
    isFinishing,
    handleStartFromButton,
    lastTime,
    lastNameActivity,
    lastMood,
    date: now,
    handleOnChanges,
    isError,
    currentLength: inputText.length,
    mood,
    handleChangeMood: setMood,
    note: timer.note || '',
    handleChangeNote: (note: string) =>
      dispatch(currentTimerSlice.actions.setSessionNote(note)),
    completedSession,
    completedGoalNames,
    handleCloseSessionSummary: () => setCompletedSession(null),
  }
}
