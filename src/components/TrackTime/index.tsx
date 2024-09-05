import React from 'react'
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite'
import PauseCircleIcon from '@mui/icons-material/PauseCircle'

import Button from '../Button'
import { TypeButton } from '../../types'

import { useTrackTime } from './useTrackTime'

const TrackTime = (): JSX.Element => {
  const {
    locale,
    time: { formattedSeconds, formattedMinutes, formattedHours },
    lastTime,
    handleStopTimer,
    handleStartFromButton,
    handlePauseTimer,
    handleStartSession,
    isPaused,
    isActive,
  } = useTrackTime()

  return (
    <div className="mx-4 mt-10">
      <div className="relative">
        <div className="text-5xl theme-text text-center">
          {formattedHours}:{formattedMinutes}:{formattedSeconds}
        </div>
        {isActive && (
          <div className="absolute top-2 right-12">
            {isPaused ? (
              <button onClick={handleStartFromButton}>
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
          <Button onClick={handleStartSession} classes="px-6">
            {locale.start}
          </Button>
        )}
        {isActive && (
          <Button variant={TypeButton.ERROR} onClick={handleStopTimer}>
            {locale.stop}
          </Button>
        )}
      </div>
      {lastTime && (
        <div className="mt-4 font-bold">
          {locale.lastTime}: {lastTime}
        </div>
      )}
    </div>
  )
}

export default TrackTime
