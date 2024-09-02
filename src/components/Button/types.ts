import { ReactNode } from 'react'
import { ClassValue } from 'clsx'

import { TypeButton } from '../../types/enums'

export type ButtonProps = {
  onClick: () => void
  classes?: ClassValue
  disabled?: boolean
  children?: ReactNode
  variant?: TypeButton
}
