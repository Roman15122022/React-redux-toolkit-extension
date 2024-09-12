import { SelectChangeEvent } from '@mui/material'

import { Language, Locale } from '../../types'

export type LocaleSwitcherProps = {
  interfaceLang: Locale
  language: Language
  handleSelectLocale: (event: SelectChangeEvent) => void
}
