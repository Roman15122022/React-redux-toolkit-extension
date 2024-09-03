import { useState, useRef, useEffect } from 'react'
import { TIME_IN_MS } from '../../constants'
import { DEFAULT_INTERVAL } from './constants'
import { StateTimer } from './types'

const useTimer = (initialTime: number) => {
  const [elapsedTime, setElapsedTime] = useState<number>(initialTime)
  const [stateTimer, setStateTimer] = useState<StateTimer>({
    isActive: false,
    isPause: false,
  })
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

  const startTimer = (): void => {
    if (intervalRef.current !== null) return

    setStateTimer(prevState => ({ ...prevState, isActive: true }))

    if (stateTimer.isPause) {
      startTimeRef.current = Date.now() - elapsedTime * TIME_IN_MS.SECOND
      setStateTimer(prevState => ({ ...prevState, isPause: false }))
    } else {
      startTimeRef.current = Date.now()
    }

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

  useEffect(() => {
    return () => {
      stopTimer()
    }
  }, [])

  return {
    startTimer,
    stopTimer,
    pauseTimer,
    resetTimer,
    seconds: elapsedTime,
    isPaused: stateTimer.isPause,
    isActive: stateTimer.isActive,
  }
}

export default useTimer
