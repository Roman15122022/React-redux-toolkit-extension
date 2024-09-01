import React from 'react'
import { useClicker } from './useClicker'
import Button from '../../components/Button'
import clsx from 'clsx'
import { ClickerProps } from './types'

export const Clicker = ({ styles, locale }: ClickerProps): JSX.Element => {
  const { handleClick, count } = useClicker()

  return (
    <div className={clsx(styles)}>
      <div className="flex justify-between items-center">
        <span className="theme-text font-semibold text-lg">
          {locale.settings.score} {count} {locale.settings.times}
        </span>
        <div className="text-center">
          <Button onClick={handleClick}>{locale.settings.button}!</Button>
        </div>
      </div>
    </div>
  )
}
