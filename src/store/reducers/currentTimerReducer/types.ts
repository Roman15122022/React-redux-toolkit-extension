import { StateTimer } from '../../../types'

export interface CurrentTimer {
  startDate: number
  elapsedTime: number
  pauseCount: number
  stateTimer: StateTimer | null
}
