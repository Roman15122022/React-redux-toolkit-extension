import { StateTimer } from '../../../types'
import { SessionConfiguration } from '../../../features/SessionTemplates/types'

export interface CurrentTimer {
  startDate: number
  elapsedTime: number
  pauseCount: number
  sessionConfiguration?: SessionConfiguration | null
  note?: string
  stateTimer: StateTimer | null
}
