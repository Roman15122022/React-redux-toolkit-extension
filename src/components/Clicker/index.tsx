import React from 'react'
import { useClicker } from './useClicker'

export const Clicker = (): JSX.Element => {
  const { handleClick } = useClicker()

  return (
    <div className="flex justify-center">
      <div className="text-center">
        <h1 className="text-lg font-semibold">Bored?</h1>
        <button
          className="mt-1 py-1.5 px-3 border-2 rounded-xl text-black hover:text-white hover:border-blue-600 hover:bg-blue-600 active:border-red-600 active:bg-red-600 active:py-1 active:px-2 active:mt-1.5 transition-colors duration-100"
          onClick={handleClick}
        >
          Clicker
        </button>
      </div>
    </div>
  )
}
