import React from 'react'

import { useStartStopButton } from './useStartStopButton'
import { StopStartButtonProps } from './types'
import { SIZE_ICON } from './constants'

const StopStartButton = ({
  isActive,
  isPaused,
  handleStartFromButton,
  handlePauseTimer,
}: StopStartButtonProps): JSX.Element => {
  const { handleClick, IconButton } = useStartStopButton(
    isPaused,
    handleStartFromButton,
    handlePauseTimer,
  )

  return (
    isActive && (
      <div className="absolute top-2 right-12">
        <button onClick={handleClick}>
          <IconButton sx={{ fontSize: SIZE_ICON }} />
        </button>
      </div>
    )
  )
}

export default StopStartButton
