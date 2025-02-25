import { SelectChangeEvent } from '@mui/material'

export type MoodSelectOptions = {
  value: string
  onChange: (event: SelectChangeEvent) => void
}
