import React from 'react'
import { createRoot } from 'react-dom/client'
import '../../assets/tailwind.css'
import Popup from './popup'
import { Provider } from 'react-redux'
import { persistor, store } from '../../store'
import { PersistGate } from 'redux-persist/integration/react'

function init() {
  const appContainer = document.createElement('div')
  document.body.appendChild(appContainer)

  if (!appContainer) {
    throw new Error('Can not find AppContainer')
  }

  const root = createRoot(appContainer)

  root.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Popup />
      </PersistGate>
    </Provider>,
  )
}

init()
