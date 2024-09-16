import { ClassValue } from 'clsx/clsx'

import { TypeButton } from '../../types'

export const variantButton: Record<TypeButton, ClassValue> = {
  [TypeButton.PRIMARY]: 'bg-secondary-light dark:bg-purple-dark',
  [TypeButton.SECONDARY]: 'bg-black dark:bg-purple-light',
  [TypeButton.ERROR]:
    'font-bold bg-black dark:bg-gray dark:text-red-dark dark:hover:bg-red-dark dark:hover:text-white',
}
