import { ClassValue } from 'clsx'

import { TypeButton } from '../../types'

export const variantButton: Record<TypeButton, ClassValue> = {
  [TypeButton.PRIMARY]: 'bg-secondary-light dark:bg-purple-dark',
  [TypeButton.SECONDARY]: 'bg-black dark:bg-purple-light',
  [TypeButton.ERROR]: 'bg-black dark:bg-red-600',
}
