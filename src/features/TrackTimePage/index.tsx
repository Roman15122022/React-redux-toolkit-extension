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
    lastNameActivity,
    date,
    handleStopTimer,
    handleStartFromButton,
    handlePauseTimer,
    handleStartSession,
    isPaused,
    isActive,
    isError,
    handleOnChanges,
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
          <div className="flex gap-3 justify-center items-center">
            <Button
              classes="mt-1"
              variant={TypeButton.SECONDARY}
              onClick={handleStopTimer}
            >
              {locale.stop}: {lastNameActivity}
            </Button>
          </div>
        ) : (
          <div className="flex gap-3 justify-center items-center">
            <InputNameActivity
              nameLabel={locale.label}
              onChanges={handleOnChanges}
              isError={isError}
            />
            <Button classes="mt-2" onClick={handleStartSession}>
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
