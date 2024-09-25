import React from 'react'

import StudyTimeInfoForDay from '../StudyTimeInfoForDay'
import StopStartButton from '../StopStartButton'
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
          <StopStartButton
            isPaused={isPaused}
            handlePauseTimer={handlePauseTimer}
            handleStartFromButton={handleStartFromButton}
          />
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
