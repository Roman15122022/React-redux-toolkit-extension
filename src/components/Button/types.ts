import { ReactNode } from 'react'
import { ClassValue } from 'clsx'

import { TypeButton } from '../../types'

export type ButtonProps = {
  onClick?: () => void
  classes?: ClassValue
  disabled?: boolean
  children?: ReactNode
  variant?: TypeButton
}

export type Links = {
  route: () => void
  variant: TypeButton
  name: string
}
