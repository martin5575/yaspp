import React from 'react'
import ReactDOM from 'react-dom'
import Root from './Root'

import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'

import { reducer } from './reducers'
import { saveState, loadState } from './utils/localStorage'
import { throttle } from 'lodash'

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

ReactDOM.render(<Root store={store} />, document.getElementById('root'))
