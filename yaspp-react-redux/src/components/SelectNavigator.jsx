import * as React from 'react'
import { Component } from 'react'
import DropDown from '../components/DropDown'

import {
  dispatchFetchMatchDays,
  dispatchFetchMatchs,
  dispatchNextMatchDay,
  dispatchPrevMatchDay,
  dispatchSelectMatchDay,
  dispatchSelectYear,
} from '../actions/ActionBuilderWithStore'

import {
  areSelectedMatchsPresent,
  areSelectedMatchDaysPresent,
} from '../utils/storeHelpers'
import { getMatchDays } from '../utils/filter'

class SelectNavigator extends Component {
  constructor(props) {
    super(props)
  }

  prevMatchDay = 'prevMatchDay'
  nextMatchDay = 'nextMatchDay'
  selectMatchDay = 'selectMatchDay'

  matchDayChange(event) {
    const store = this.props.store
    switch (event.target.id) {
      case this.nextMatchDay:
        dispatchNextMatchDay(store)
        break
      case this.prevMatchDay:
        dispatchPrevMatchDay(store)
        break
      case this.selectMatchDay:
        dispatchSelectMatchDay(store, parseInt(event.target.value))
        break
      default:
        return
    }
    if (!areSelectedMatchsPresent(store)) {
      const state = store.getState()
      dispatchFetchMatchs(
        store,
        state.selectedLeague,
        state.selectedYear,
        state.selectedMatchDay
      )
    }
  }

  async selectionChange(event) {
    const store = this.props.store
    let state = store.getState()
    if (event.target.id === 'year') {
      dispatchSelectYear(store, state.selectedLeague, event.target.value)
    }
    if (!areSelectedMatchDaysPresent(store)) {
      state = store.getState()
      dispatchFetchMatchDays(store, state.selectedLeague, state.selectedYear)
    }
    state = store.getState()
    const selectedMatchDay = state.selectedMatchDay ? state.selectedMatchDay : 1
    dispatchSelectMatchDay(store, selectedMatchDay)

    if (!areSelectedMatchsPresent(store)) {
      const state = store.getState()
      dispatchFetchMatchs(
        store,
        state.selectedLeague,
        state.selectedYear,
        state.selectedMatchDay
      )
    }
  }

  render() {
    const state = this.props.store.getState()
    const relevantMatchDays = getMatchDays(state)
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-2">
            <button
              className="btn form-control"
              id={this.prevMatchDay}
              onClick={this.matchDayChange.bind(this)}
            >
              {'<'}
            </button>
          </div>
          <div className="col-xs-8">
            <DropDown
              value={state.selectedMatchDay}
              onChange={this.matchDayChange.bind(this)}
              id={this.selectMatchDay}
              data={relevantMatchDays}
            />
          </div>
          <div className="col-xs-2">
            <button
              className="btn form-control"
              id={this.nextMatchDay}
              onClick={this.matchDayChange.bind(this)}
            >
              {'>'}
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default SelectNavigator
