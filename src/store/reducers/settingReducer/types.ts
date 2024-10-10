import { Language, ThemeVariants } from '../../../types'

export interface Setting {
  language: Language
  theme: ThemeVariants
  saveStateAfterClose: boolean
}
