import React from 'react'

import './popup.css'
import { usePopup } from './usePopup'

const Popup = (): JSX.Element => {
  const { locale } = usePopup()

  return (
    <div className="theme-text">
      <h1 className="text-xl text-text font-semibold text-center my-2">
        {locale.title}
      </h1>
    </div>
  )
}

export default Popup
