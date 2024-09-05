import { useState, useRef, useEffect } from 'react'
import { TIME_IN_MS } from '../../constants'
import { DEFAULT_INTERVAL } from './constants'
import { StateTimer } from '../../types'

const useTimer = (
  initialTime: number = 0,
  storeElapsedTime: number = 0,
  storeState: StateTimer | null = null,
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
    startTimeRef.current = 0
    setStateTimer({
      isActive: false,
      isPause: false,
    })
  }

  const stopAndResetTimer = (): void => {
    clearInterval(intervalRef.current as NodeJS.Timeout)
    intervalRef.current = null
    resetTimer()
  }

  const initializeTimer = (): void => {
    if (initialTime <= 0) return

    startTimeRef.current = Date.now() - initialTime * TIME_IN_MS.SECOND
  }

  const startTimer = (): void => {
    if (intervalRef.current || initialTime < 0 || elapsedTime < 0) return

    if (stateTimer.isPause) {
      startTimeRef.current = Date.now() - elapsedTime * TIME_IN_MS.SECOND
    }

    if (!stateTimer.isPause) {
      startTimeRef.current = Date.now() - initialTime * TIME_IN_MS.SECOND
    }

    intervalRef.current = setInterval(() => {
      const currentTime = Date.now()
      const timeElapsed = Math.floor(
        (currentTime - startTimeRef.current) / TIME_IN_MS.SECOND,
      )
      setElapsedTime(timeElapsed)
    }, DEFAULT_INTERVAL)

    setStateTimer({ isPause: false, isActive: true })
  }

  const pauseTimer = (): void => {
    if (!intervalRef.current) return

    clearInterval(intervalRef.current as NodeJS.Timeout)
    intervalRef.current = null
    setStateTimer({ isPause: true, isActive: true })
  }

  useEffect(() => {
    return () => clearInterval(intervalRef.current as NodeJS.Timeout)
  }, [])

  return {
    startTimer,
    stopAndResetTimer,
    pauseTimer,
    resetTimer,
    initializeTimer,
    seconds: elapsedTime,
    stateTimer,
  }
}

export default useTimer
