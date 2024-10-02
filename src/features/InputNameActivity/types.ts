import { SyntheticEvent } from 'react'

export type InputNameActivityProps = {
  nameLabel: string
  currentLength: number
  onChanges: (_event: SyntheticEvent, value: string) => void
  isError: boolean
}
