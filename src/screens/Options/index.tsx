import React from 'react'
import { createRoot } from 'react-dom/client'
import '../../assets/tailwind.css'
import Options from './options'
import { Provider } from 'react-redux'
import { setupStore } from '../../store'

function init() {
  const appContainer = document.createElement('div')
  document.body.appendChild(appContainer)

  if (!appContainer) {
    throw new Error('Can not find AppContainer')
  }

  const root = createRoot(appContainer)
  const store = setupStore()

  root.render(
    <Provider store={store}>
      <Options />
    </Provider>,
  )
}

init()
