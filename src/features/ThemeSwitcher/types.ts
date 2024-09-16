import { Locale } from '../../types'

export type ThemeSwitcherProps = {
  switchTheme: () => void
  isDark: boolean
  interfaceLang: Locale
}
