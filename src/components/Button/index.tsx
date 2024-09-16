import React from 'react'

import { cn } from '../../utils'
import { TypeButton } from '../../types'

import { ButtonProps } from './types'
import { variantButton } from './constants'

const Button = ({
  children,
  onClick,
  classes,
  disabled,
  variant,
}: ButtonProps): JSX.Element => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'px-4 py-2 text-white hover:text-black hover:dark:bg-white hover:bg-white disabled:opacity-70 font-semibold rounded-lg shadow-md transition-colors duration-300',
        classes,
        variantButton[variant || TypeButton.PRIMARY],
      )}
    >
      {children}
    </button>
  )
}

export default Button
