import React from 'react'

import Button from '../Button'
import { TypeButton } from '../../types/enums'

import { useTrackTime } from './useTrackTime'

const TrackTime = (): JSX.Element => {
  const {
    locale,
    time,
    stopTimer,
    startTimer,
    pauseTimer,
    isPaused,
    isActive,
  } = useTrackTime()

  return (
    <div className="mt-6">
      <div>
        <p className="text-2xl theme-text text-center">{time}</p>
      </div>
      <div className="mt-8 flex justify-center items-center">
        {(!isActive || isPaused) && (
          <Button onClick={startTimer}>{locale.start}</Button>
        )}
        {isActive && (
          <Button variant={TypeButton.ERROR} onClick={stopTimer}>
            {locale.stop}
          </Button>
        )}
        {isActive && (
          <Button variant={TypeButton.SECONDARY} onClick={pauseTimer}>
            {locale.pause}
          </Button>
        )}
      </div>
    </div>
  )
}

export default TrackTime
