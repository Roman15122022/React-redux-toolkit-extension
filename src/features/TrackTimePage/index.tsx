import React from 'react'
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite'
import PauseCircleIcon from '@mui/icons-material/PauseCircle'

import StudyTimeInfoForDay from '../StudyTimeInfoForDay'
import { TypeButton } from '../../types'
import Container from '../../components/Container'
import Button from '../../components/Button'

import { useTrackTime } from './useTrackTime'

const TrackTimePage = (): JSX.Element => {
  const {
    locale,
    time: { formattedSeconds, formattedMinutes, formattedHours },
    lastTime,
    date,
    handleStopTimer,
    handleStartFromButton,
    handlePauseTimer,
    handleStartSession,
    isPaused,
    isActive,
  } = useTrackTime()

  return (
    <Container>
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
        {!isActive ? (
          <Button onClick={handleStartSession}>{locale.start}</Button>
        ) : (
          <Button variant={TypeButton.SECONDARY} onClick={handleStopTimer}>
            {locale.stop}
          </Button>
        )}
      </div>
      <StudyTimeInfoForDay lastTime={lastTime} date={date} isLastTimeNeeded />
    </Container>
  )
}

export default TrackTimePage
