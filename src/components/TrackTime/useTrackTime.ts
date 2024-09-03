import { useTranslate } from '../../hooks/useTranslate'
import useTimer from '../../hooks/useTimer/inex'

import { formatTime } from './helpers'
import { INITIAL_TIME } from './consants'

export const useTrackTime = () => {
  const { interfaceLang } = useTranslate()

  const { seconds, isPaused, isActive, pauseTimer, stopTimer, startTimer } =
    useTimer(INITIAL_TIME)

  return {
    locale: interfaceLang.popup.track,
    time: formatTime(seconds),
    startTimer,
    stopTimer,
    pauseTimer,
    isPaused,
    isActive,
  }
}
