import type { Locale, StudyStreak } from '../../types'

export type StudyStreakProgressProps = {
  locale: Locale['popup']['statistics']['streak']
  streak: StudyStreak
}
