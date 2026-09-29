import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'
import React from 'react'
import '../../assets/tailwind.css'

import { persistor, store } from '../../store'

import SidePanel from './sidePanel'
import './sidePanel.css'

const appContainer = document.createElement('div')
document.body.appendChild(appContainer)

createRoot(appContainer).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <SidePanel />
    </PersistGate>
  </Provider>,
)
