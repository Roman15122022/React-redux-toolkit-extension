import { ClassValue } from 'clsx'

import { TypeButton } from '../../types'

export const variantButton: Record<TypeButton, ClassValue> = {
  [TypeButton.PRIMARY]: 'bg-secondary-light dark:bg-purple-dark',
  [TypeButton.SECONDARY]: 'bg-gray',
  [TypeButton.ERROR]: 'bg-black dark:bg-purple-light',
}
