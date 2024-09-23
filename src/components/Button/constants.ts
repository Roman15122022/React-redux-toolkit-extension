import { ClassValue } from 'clsx/clsx'

import { TypeButton } from '../../types'

export const variantButton: Record<TypeButton, ClassValue> = {
  [TypeButton.PRIMARY]: 'bg-secondary-light dark:bg-purple-dark',
  [TypeButton.SECONDARY]: 'bg-black dark:bg-purple-light',
  [TypeButton.ERROR]:
    'font-extrabold bg-black dark:bg-[#212830] border-2 dark:border-red-dark dark:text-red-dark dark:hover:bg-red-dark dark:hover:text-white',
  [TypeButton.LINK]: `font-bold text-[13px] shadow-none text-black
     hover:text-secondary-light
     dark:text-white dark:border-black
     dark:hover:bg-black dark:hover:text-purple-light
     duration-0`,
  [TypeButton.ACTIVE_LINK]: `font-bold text-[13px] shadow-none text-secondary-light
    dark:text-purple-light dark:hover:bg-black
    hover:text-secondary-light
    duration-0`,
  [TypeButton.PAGE]:
    'font-semibold px-2.5 py-1 rounded-3xl text-theme border-2 border-white dark:border-black',
  [TypeButton.CURRENT_PAGE]:
    'font-semibold px-2.5 py-1 rounded-3xl text-secondary-light dark:text-purple-light border-2 border-secondary-light dark:border-purple-dark',
}
