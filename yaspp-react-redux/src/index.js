import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'
import Root from './Root'

import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'

import { reducer } from './reducers'
import { saveState, loadState } from './utils/localStorage'
import { throttle } from 'lodash'

import moment from 'moment'
import 'moment/locale/de'

/******************* Set globals ******************/
moment.locale("de")

/******************* Create Store ******************/
const thunk = ReduxThunk
const persistedState = loadState()
const store = createStore(reducer, persistedState, applyMiddleware(thunk))

store.subscribe(
  throttle(() => {
    const model = store.getState().model
    saveState({ model })
  }, 1000)
)

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <React.StrictMode>
  <Provider store={store}>
      <Root store={store} />
    </Provider>
  </React.StrictMode>
)
