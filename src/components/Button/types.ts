import { ReactNode } from 'react'

export type ButtonProps = {
  onClick: () => void
  classes?: string
  disabled?: boolean
  children?: ReactNode
}
