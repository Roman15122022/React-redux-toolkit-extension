import { useState, useRef } from 'react'
import { TIME_IN_MS } from '../../constants'
import { DEFAULT_INTERVAL } from './constants'
import { StateTimer } from '../../types'

const useTimer = (
  initialTime: number,
  storeElapsedTime: number,
  storeState: StateTimer | null,
) => {
  const [elapsedTime, setElapsedTime] = useState<number>(storeElapsedTime)
  const [stateTimer, setStateTimer] = useState<StateTimer>(
    storeState || {
      isActive: false,
      isPause: false,
    },
  )
  const startTimeRef = useRef<number>(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const resetTimer = (): void => {
    setElapsedTime(0)
    setStateTimer({
      isActive: false,
      isPause: false,
    })

    startTimeRef.current = 0
  }

  const stopTimer = (): void => {
    clearInterval(intervalRef.current as NodeJS.Timeout)
    intervalRef.current = null
    resetTimer()
  }

  const initializeTimer = (): void => {
    startTimeRef.current = Date.now() - initialTime * TIME_IN_MS.SECOND

  }

  const startTimer = (): void => {
    if (intervalRef.current !== null) return

    if (stateTimer.isPause) {
      startTimeRef.current = Date.now() - elapsedTime * TIME_IN_MS.SECOND
    } else {
      startTimeRef.current = Date.now() - initialTime * TIME_IN_MS.SECOND
    }

    setStateTimer({ isPause: false, isActive: true })

    intervalRef.current = setInterval(() => {
      const currentTime = Date.now()
      const timeElapsed = Math.floor(
        (currentTime - startTimeRef.current!) / TIME_IN_MS.SECOND,
      )
      setElapsedTime(timeElapsed)
    }, DEFAULT_INTERVAL)
  }

  const pauseTimer = (): void => {
    if (intervalRef.current === null) return

    clearInterval(intervalRef.current as NodeJS.Timeout)
    intervalRef.current = null
    setStateTimer(prevState => ({
      ...prevState,
      isPause: true,
    }))
  }

  return {
    startTimer,
    stopTimer,
    pauseTimer,
    resetTimer,
    initializeTimer,
    seconds: elapsedTime,
    stateTimer,
  }
}

export default useTimer
