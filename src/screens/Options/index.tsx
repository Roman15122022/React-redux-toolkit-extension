import { createRoot } from 'react-dom/client'
import React from 'react'
import '../../assets/tailwind.css'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { persistor, store } from '../../store'

import Options from './options'

function init(): void {
  const appContainer = document.createElement('div')
  document.body.appendChild(appContainer)

  if (!appContainer) {
    throw new Error('Can not find AppContainer')
  }

  const root = createRoot(appContainer)

  root.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Options />
      </PersistGate>
    </Provider>,
  )
}

init()
