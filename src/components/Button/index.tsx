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
        'py-1.5 px-3 border-2 cursor-pointer rounded-xl text-black hover:text-white hover:border-blue-600 hover:bg-blue-600 active:border-red-600 active:bg-red-600 transition-colors duration-100',
        classes,
      )}
    >
      {children}
    </button>
  )
}

export default Button
