import React from 'react'

import './popup.css'
import PopupRouter from '../../components/PopupRouter'
import Button from '../../components/Button'

import { usePopup } from './usePopup'

const Popup = (): JSX.Element => {
  const { links } = usePopup()

  return (
    <div className="theme-text min-h-[400px] overflow-hidden bg-white dark:bg-black">
      <div className="mx-2 mt-2 flex justify-center rounded-2xl bg-[#fff7f4] px-1 py-1 dark:bg-[#160f17]">
        {links.map(({ route, variant, name }) => (
          <Button
            key={name}
            onClick={route}
            variant={variant}
            classes="px-2 py-2"
          >
            {name}
          </Button>
        ))}
      </div>
      <main className="mx-2 mb-2 mt-2 overflow-hidden rounded-2xl border border-[#eadeda] bg-[#fffaf8] dark:border-[#3b2440] dark:bg-[#120d13]">
        <PopupRouter />
      </main>
    </div>
  )
}

export default Popup
