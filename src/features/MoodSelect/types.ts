import { SelectChangeEvent } from '@mui/material'

export type MoodSelectOptions = {
  value: number
  onChange: (event: SelectChangeEvent) => void
}
