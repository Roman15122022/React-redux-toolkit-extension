import { StateTimer } from '../../../types'

export interface CurrentTimer {
  startDate: number
  elapsedTime: number
  stateTimer: StateTimer | null
}
