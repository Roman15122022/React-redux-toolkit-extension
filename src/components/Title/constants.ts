import { ClassValue } from 'clsx/clsx'

import { TypeTittle } from '../../types'

export const variantTitle: Record<TypeTittle, ClassValue> = {
  [TypeTittle.LARGE]: 'font-bold theme-text text-2xl',
  [TypeTittle.DEFAULT]: 'font-semibold theme-text text-xl',
  [TypeTittle.SMALL]: 'theme-text text-lg ',
}
