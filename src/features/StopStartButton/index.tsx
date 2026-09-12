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
      <div className="flex shrink-0 items-center">
        <button
          type="button"
          onClick={handleClick}
          className="flex h-10 w-10 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-light dark:focus-visible:outline-purple-light"
        >
          <IconButton sx={{ fontSize: SIZE_ICON }} />
        </button>
      </div>
    )
  )
}

export default StopStartButton
