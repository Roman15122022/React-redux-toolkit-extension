import { PersistGate } from 'redux-persist/integration/react'
import { HashRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'
import React from 'react'
import '../../assets/tailwind.css'

import { persistor, store } from '../../store'

import Popup from './popup'

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
        <Router>
          <Popup />
        </Router>
      </PersistGate>
    </Provider>,
  )
}

init()
