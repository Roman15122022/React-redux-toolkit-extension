import React from 'react'
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite'
import PauseCircleIcon from '@mui/icons-material/PauseCircle'

import Button from '../Button'
import { TypeButton } from '../../types'

import { useTrackTime } from './useTrackTime'

const TrackTime = (): JSX.Element => {
  const {
    locale,
    time,
    handleStopTimer,
    handleStartTimer,
    handlePauseTimer,
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
              <button onClick={handleStartTimer}>
                <PlayCircleFilledWhiteIcon sx={{ fontSize: 36 }} />
              </button>
            ) : (
              <button onClick={handlePauseTimer}>
                <PauseCircleIcon sx={{ fontSize: 36 }} />
              </button>
            )}
          </div>
        )}
      </div>
      <div className="mt-8 flex justify-evenly items-center">
        {!isActive && (
          <Button onClick={handleStartTimer} classes="px-6">
            {locale.start}
          </Button>
        )}
        {isActive && (
          <Button variant={TypeButton.ERROR} onClick={handleStopTimer}>
            {locale.stop}
          </Button>
        )}
      </div>
    </div>
  )
}

export default TrackTime
