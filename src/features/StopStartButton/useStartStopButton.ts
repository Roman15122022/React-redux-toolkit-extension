import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite'
import PauseCircleIcon from '@mui/icons-material/PauseCircle'

export const useStartStopButton = (
  isPaused: boolean,
  handleStartFromButton: () => void,
  handlePauseTimer: () => void,
) => {
  const IconButton = isPaused ? PlayCircleFilledWhiteIcon : PauseCircleIcon
  const handleClick = isPaused ? handleStartFromButton : handlePauseTimer

  return { IconButton, handleClick }
}
