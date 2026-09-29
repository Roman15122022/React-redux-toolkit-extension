import { StateTimer } from '../../../types'

export interface CurrentTimer {
  startDate: number
  elapsedTime: number
  pauseCount: number
  note?: string
  stateTimer: StateTimer | null
}
