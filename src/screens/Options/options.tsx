import React from 'react'
import { useOptions } from './useOptions'

const Options = () => {
  const { count } = useOptions()

  return (
    <div>
      <h1 className="font-bold text-2xl mt-4 ml-4">Settings👨‍🎓</h1>
      <p>You clicked {count} time(s)</p>
    </div>
  )
}

export default Options
