import React from 'react'
import clsx from 'clsx'

import { TypeTittle } from '../../types'
import Title from '../../components/Title'
import Button from '../../components/Button'

import { useClicker } from './useClicker'
import { ClickerProps } from './types'

export const Clicker = ({ styles, locale }: ClickerProps): JSX.Element => {
  const { handleClick, count } = useClicker()

  return (
    <div className={clsx(styles)}>
      <div className="flex justify-between items-center">
        <Title
          title={`${locale.settings.score} ${count} ${locale.settings.times}`}
          variant={TypeTittle.SMALL}
        />
        <div className="text-center">
          <Button onClick={handleClick}>{locale.settings.button}!</Button>
        </div>
      </div>
    </div>
  )
}
