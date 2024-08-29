import { useState } from 'react'
import { Language } from '../../types/enums'

export const useTranslate = () => {
  const [locale, setTheme] = useState<Language>(Language.EN)
}
