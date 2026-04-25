export type HistoryDate = {
  name: string
  onClick: () => void
  isSelected: boolean
}

export type HistoryView = 'list' | 'calendar'

export type DateInfo = {
  localizeName: string
  date: number
}
