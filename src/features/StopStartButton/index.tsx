import React from 'react'

import { useStartStopButton } from './useStartStopButton'
import { StopStartButtonProps } from './types'
import { SIZE_ICON } from './constants'

const StopStartButton = ({
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
    <div>
      <div className="absolute top-2 right-12">
        <button onClick={handleClick}>
          <IconButton sx={{ fontSize: SIZE_ICON }} />
        </button>
      </div>
    </div>
  )
}

export default StopStartButton
