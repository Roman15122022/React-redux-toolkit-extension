import React from 'react'
import './popup.css'
import { Clicker } from '../../features/Clicker'

const Popup = (): JSX.Element => {
  return (
    <div>
      <h1 className="text-xl font-semibold text-center my-2">
        Track your study time!
      </h1>
      <Clicker />
    </div>
  )
}

export default Popup
