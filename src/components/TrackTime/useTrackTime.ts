import { useTranslate } from '../../hooks/useTranslate'
import { useTimer } from '../../hooks/useTimer/inex'

import { INITIAL_TIME } from './consants'

export const useTrackTime = () => {
  const { interfaceLang } = useTranslate()

  const { time, start, stop, pause, isPaused, isActive } =
    useTimer(INITIAL_TIME)

  return {
    locale: interfaceLang.popup.track,
    time,
    start,
    stop,
    pause,
    isActive,
    isPaused,
  }
}
