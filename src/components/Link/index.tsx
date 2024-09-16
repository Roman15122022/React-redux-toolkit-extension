import React from 'react'

import { cn } from '../../utils'

import { LinkProps } from './types'

const Link = ({ href, children, classes }: LinkProps): JSX.Element => {
  return (
    <a
      target="_blank"
      href={href}
      className={cn(
        classes,
        'font-bold text-secondary-light dark:text-purple-light opacity-100 hover:text-purple-dark dark:hover:text-secondary-dark transition-colors duration-300',
      )}
    >
      {children}
    </a>
  )
}

export default Link
