import React from 'react'

import './popup.css'
import PopupRouter from '../../components/PopupRouter'
import Button from '../../components/Button'

import { usePopup } from './usePopup'

const Popup = (): JSX.Element => {
  const {
    links,
    canOpenSidePanel,
    handleToggleSidePanel,
    panelOpen,
    panelDisabled,
    panelError,
    panelLocale,
  } = usePopup()

  return (
    <div className="theme-text flex h-[500px] flex-col overflow-hidden bg-white dark:bg-black">
      <div className="mx-2 mt-2 flex shrink-0 justify-center rounded-2xl bg-[#fff7f4] px-1 py-1 dark:bg-[#160f17]">
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
      {canOpenSidePanel && (
        <div className="mx-3 mt-1 shrink-0 text-right">
          <button
            type="button"
            onClick={handleToggleSidePanel}
            disabled={panelDisabled}
            className="theme-text rounded-md px-2 py-1 text-xs font-semibold text-secondary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary-light dark:text-purple-light dark:focus-visible:outline-purple-light"
          >
            {panelOpen ? panelLocale.close : panelLocale.open}
          </button>
          {panelError && (
            <p role="alert" className="text-xs text-red-600">
              {panelError === 'close'
                ? panelLocale.closeError
                : panelLocale.openError}
            </p>
          )}
        </div>
      )}
      <main className="mx-2 mb-2 mt-2 min-h-0 flex-1 overflow-x-hidden overflow-y-auto rounded-2xl border border-[#eadeda] bg-[#fffaf8] dark:border-[#3b2440] dark:bg-[#120d13]">
        <PopupRouter />
      </main>
    </div>
  )
}

export default Popup
