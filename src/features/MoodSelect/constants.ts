import SentimentVerySatisfiedRoundedIcon from '@mui/icons-material/SentimentVerySatisfiedRounded'
import SentimentVeryDissatisfiedRoundedIcon from '@mui/icons-material/SentimentVeryDissatisfiedRounded'
import SentimentSatisfiedRoundedIcon from '@mui/icons-material/SentimentSatisfiedRounded'
import SentimentNeutralRoundedIcon from '@mui/icons-material/SentimentNeutralRounded'
import SentimentDissatisfiedRoundedIcon from '@mui/icons-material/SentimentDissatisfiedRounded'

import { ThemeVariants } from '../../types'

export const MoodColorDictionary = {
  1: { [ThemeVariants.DARK]: '#E53935', [ThemeVariants.LIGHT]: '#E53935' },
  2: { [ThemeVariants.DARK]: '#FB8C00', [ThemeVariants.LIGHT]: '#FB8C00' },
  3: { [ThemeVariants.DARK]: '#F5F5F5', [ThemeVariants.LIGHT]: '#F5F5F5' },
  4: { [ThemeVariants.DARK]: '#1E88E5', [ThemeVariants.LIGHT]: '#1E88E5' },
  5: { [ThemeVariants.DARK]: '#43A047', [ThemeVariants.LIGHT]: '#43A047' },
} as const

export const MOOD_MAIN_PURPLE = '#B12ACB'

export const MOOD_DARK_BG = '#050505'

export const MOOD_SELECTED_BG_ALPHA = '1F'

export const MOOD_SELECTED_SHADOW_ALPHA = '66'

export const MOOD_SELECT_ICON_SIZE = {
  selected: 22,
  default: 20,
} as const

export const MoodSelectClasses = {
  root: 'flex w-[190px] flex-col items-center',
  pill: [
    'flex h-10 w-full items-center justify-center gap-1.5 rounded-full border-2 px-2',
    'border-[#B12ACB] bg-black/90 shadow-[0_0_12px_rgba(177,42,203,0.2)]',
    'dark:bg-[#050505]',
  ],
  buttonBase: [
    'flex shrink-0 items-center justify-center rounded-full',
    'transition-all duration-200 ease-out',
    'hover:scale-110 hover:shadow-[0_0_14px_rgba(177,42,203,0.38)]',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
    'focus-visible:outline-[#B12ACB]',
  ],
  selectedButton: 'h-8 w-8 border-2 bg-white/10',
  button: 'h-7 w-7 border border-transparent opacity-80',
  label: 'mt-1 text-center text-[10px] font-semibold theme-text',
  labelValue: 'text-secondary-light dark:text-purple-light',
} as const

export const MoodIcons = {
  1: SentimentVeryDissatisfiedRoundedIcon,
  2: SentimentDissatisfiedRoundedIcon,
  3: SentimentNeutralRoundedIcon,
  4: SentimentSatisfiedRoundedIcon,
  5: SentimentVerySatisfiedRoundedIcon,
} as const

export const MoodLabelKeys = {
  1: 'veryDissatisfied',
  2: 'dissatisfied',
  3: 'neutral',
  4: 'satisfied',
  5: 'verySatisfied',
} as const
