import SwapVertIcon from '@mui/icons-material/SwapVert'

import { Sort } from '../../types'

export type Achievements = {
  name: string
  totalTime: string
  percents: number
  isSpec: boolean
  totalTimeInSeconds: number
}

export type KindOfSorts = Record<Sort, SortField>

export type SortField = {
  icon: typeof SwapVertIcon
  onClick: () => void
}
