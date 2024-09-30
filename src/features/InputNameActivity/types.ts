import { SyntheticEvent } from 'react'

export type InputNameActivityProps = {
  nameLabel: string
  onChanges: (_event: SyntheticEvent, value: string) => void
  isError: boolean
}
