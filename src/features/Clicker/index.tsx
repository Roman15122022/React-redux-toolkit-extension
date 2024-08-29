import React from 'react'
import { useClicker } from './useClicker'
import Button from '../../components/Button'

export const Clicker = (): JSX.Element => {
  const { handleClick } = useClicker()

  return (
    <div className="flex justify-center">
      <div className="text-center">
        <h1 className="text-lg font-semibold">Bored?</h1>
        <Button onClick={handleClick}>Click!</Button>
      </div>
    </div>
  )
}
