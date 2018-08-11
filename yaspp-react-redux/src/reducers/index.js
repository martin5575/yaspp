import { combineReducers } from 'redux'
import { uiReducer } from './uiReducer'
import { modelReducer } from './modelReducer'

export const reducer = combineReducers({ ui: uiReducer, model: modelReducer })
