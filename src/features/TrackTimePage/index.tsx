import React from 'react'

import StudyTimeInfoForDay from '../StudyTimeInfoForDay'
import StopStartButton from '../StopStartButton'
import InputNameActivity from '../InputNameActivity'
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
        <StopStartButton
          isActive={isActive}
          isPaused={isPaused}
          handlePauseTimer={handlePauseTimer}
          handleStartFromButton={handleStartFromButton}
        />
      </div>
      <div className="mt-8 flex justify-evenly items-center">
        {isActive ? (
          <Button variant={TypeButton.SECONDARY} onClick={handleStopTimer}>
            {locale.stop}
          </Button>
        ) : (
          <div className="flex gap-3 justify-center items-center">
            <InputNameActivity nameLabel={locale.label} />
            <Button classes="mt-1" onClick={handleStartSession}>
              {locale.start}
            </Button>
          </div>
        )}
      </div>
      <StudyTimeInfoForDay lastTime={lastTime} date={date} isLastTimeNeeded />
    </Container>
  )
}

export default TrackTimePage
