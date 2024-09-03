import React from 'react'
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite'
import PauseCircleIcon from '@mui/icons-material/PauseCircle'

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
    <div className="mt-8">
      <div className="relative">
        <div className="text-5xl theme-text text-center">{time}</div>
        {isActive && (
          <div className="absolute top-2 right-16">
            {isPaused ? (
              <button onClick={startTimer}>
                <PlayCircleFilledWhiteIcon sx={{ fontSize: 36 }} />
              </button>
            ) : (
              <button onClick={pauseTimer}>
                <PauseCircleIcon sx={{ fontSize: 36 }} />
              </button>
            )}
          </div>
        )}
      </div>
      <div className="mt-8 flex justify-evenly items-center">
        {!isActive && (
          <Button onClick={startTimer} classes="px-6">
            {locale.start}
          </Button>
        )}
        {isActive && (
          <Button variant={TypeButton.ERROR} onClick={stopTimer}>
            {locale.stop}
          </Button>
        )}
      </div>
    </div>
  )
}

export default TrackTime
