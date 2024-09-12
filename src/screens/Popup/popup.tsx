import React from 'react'

import './popup.css'
import TrackTime from '../../features/TrackTime'
import Title from '../../components/Title'

import { usePopup } from './usePopup'

const Popup = (): JSX.Element => {
  const { locale } = usePopup()

  return (
    <div className="theme-text">
      <Title title={locale.title} classes="text-center my-2" />
      <TrackTime />
    </div>
  )
}

export default Popup
