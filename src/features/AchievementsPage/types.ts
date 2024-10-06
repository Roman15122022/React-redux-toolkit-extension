import SwapVertIcon from '@mui/icons-material/SwapVert'

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

export enum Sort {
  ALPHABET = 'alphabet',
  TIME = 'time',
  REVERSE_TIME = 'reverseTime',
}
