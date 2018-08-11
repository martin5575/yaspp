import * as React from 'react'
import { Component } from 'react'
import ListNavigator from './ListNavigator'

import {
  dispatchFetchMatchs,
  dispatchSelectMatchDay,
} from '../actions/ActionBuilderWithStore'

import { areSelectedMatchsPresent } from '../utils/storeHelpers'
import { getMatchDays } from '../utils/filter'

class MatchdayNavigator extends Component {
  constructor(props) {
    super(props)
  }

  onSelect(id) {
    const store = this.props.store
    dispatchSelectMatchDay(store, parseInt(id))
    this.updateMatchs()
  }

  updateMatchs() {
    const store = this.props.store
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
      <div className="mx-auto">
        <ListNavigator
          data={relevantMatchDays}
          selected={state.selectedMatchDay}
          onSelect={this.onSelect.bind(this)}
        />
      </div>
    )
  }
}

export default MatchdayNavigator
