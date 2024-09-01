import React from 'react'
import { ButtonProps } from './types'
import clsx from 'clsx'

const Button = ({
  children,
  onClick,
  classes,
  disabled,
}: ButtonProps): JSX.Element => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'px-4 py-2 bg-purple-light dark:bg-purple-dark text-white font-semibold rounded-lg shadow-md hover:bg-white hover:text-black hover:dark:bg-white transition-colors duration-300',
        classes,
      )}
    >
      {children}
    </button>
  )
}

export default Button
