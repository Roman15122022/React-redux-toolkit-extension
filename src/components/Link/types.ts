import { ReactNode } from 'react'
import { ClassValue } from 'clsx'

export type LinkProps = {
  href: string
  children?: ReactNode
  classes?: ClassValue
}
