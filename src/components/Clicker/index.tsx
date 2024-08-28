import React from 'react'
import { useClicker } from './useClicker'

export const Clicker = (): JSX.Element => {
  const { count, handleClick } = useClicker()

  return (
    <div className="flex justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold">Bored?</h1>
        <button
          className="mt-1 py-1 px-2 border-2 rounded-md"
          onClick={handleClick}
        >
          Clicker
        </button>
        <div>{count}</div>
      </div>
    </div>
  )
}
