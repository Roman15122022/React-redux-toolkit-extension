import React from 'react'
import clsx from 'clsx'

import { TypeButton } from '../../types/enums'

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
      className={clsx(
        'px-4 py-2 text-white  hover:text-black hover:dark:bg-white hover:bg-white font-semibold rounded-lg shadow-md transition-colors duration-300',
        classes,
        variantButton[variant || TypeButton.PRIMARY],
      )}
    >
      {children}
    </button>
  )
}

export default Button
