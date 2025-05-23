import React from 'react'

import './popup.css'
import PopupRouter from '../../components/PopupRouter'
import Button from '../../components/Button'

import { usePopup } from './usePopup'

const Popup = (): JSX.Element => {
  const { links } = usePopup()

  return (
    <div className="theme-text">
      <div className="my-2 flex justify-center">
        {links.map(({ route, variant, name }) => (
          <Button key={name} onClick={route} variant={variant}>
            {name}
          </Button>
        ))}
      </div>
      <PopupRouter />
    </div>
  )
}

export default Popup
