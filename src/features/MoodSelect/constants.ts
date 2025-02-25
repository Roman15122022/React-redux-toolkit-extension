import { ThemeVariants } from '../../types'

export const MoodColorDictionary = {
  1: { [ThemeVariants.DARK]: 'red', [ThemeVariants.LIGHT]: 'red' },
  2: { [ThemeVariants.DARK]: 'orange', [ThemeVariants.LIGHT]: 'orange' },
  3: { [ThemeVariants.DARK]: 'white', [ThemeVariants.LIGHT]: 'black' },
  4: { [ThemeVariants.DARK]: 'blue', [ThemeVariants.LIGHT]: 'blue' },
  5: { [ThemeVariants.DARK]: 'green', [ThemeVariants.LIGHT]: 'green' },
} as const
