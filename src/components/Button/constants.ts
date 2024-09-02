import { ClassValue } from 'clsx'

import { TypeButton } from '../../types/enums'

export const variantButton: Record<TypeButton, ClassValue> = {
  [TypeButton.PRIMARY]: 'bg-purple-light dark:bg-purple-dark',
  [TypeButton.SECONDARY]: 'bg-gray',
  [TypeButton.ERROR]: 'bg-secondary-light dark:bg-secondary-dark',
}
