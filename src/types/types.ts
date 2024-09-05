import { TRANSLATIONS } from '../hooks/useTranslate/constants'

export type StateTimer = {
  isActive: boolean
  isPause: boolean
}

export type Locale = (typeof TRANSLATIONS)['ua']
