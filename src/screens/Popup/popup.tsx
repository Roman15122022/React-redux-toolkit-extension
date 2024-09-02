import React from 'react'

import './popup.css'
import TrackTime from '../../components/TrackTime'

import { usePopup } from './usePopup'

const Popup = (): JSX.Element => {
  const { locale } = usePopup()

  return (
    <div className="theme-text">
      <h1 className="text-xl text-text font-semibold text-center my-2">
        {locale.title}
      </h1>
      <TrackTime />
    </div>
  )
}

export default Popup
