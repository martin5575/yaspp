import React from 'react'
import ReactDOM from 'react-dom'
import Root from './Root'

import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'

import { reducer } from './reducers'

/******************* Create Store ******************/
const thunk = ReduxThunk
const store = createStore(reducer, applyMiddleware(thunk))

ReactDOM.render(<Root store={store} />, document.getElementById('root'))
