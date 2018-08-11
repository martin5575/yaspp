import * as React from 'react'
import { Component } from 'react'
import SelectNavigator from './SelectNavigator'

import {
  dispatchFetchMatchs,
  dispatchNextMatchDay,
  dispatchPrevMatchDay,
  dispatchSelectMatchDay,
} from '../actions/ActionBuilderWithStore'

import { areSelectedMatchsPresent } from '../utils/storeHelpers'
import { getMatchDays } from '../utils/filter'

class MatchdayNavigator extends Component {
  constructor(props) {
    super(props)
  }

  onNext() {
    const store = this.props.store
    dispatchNextMatchDay(store)
    this.updateMatchs()
  }

  onPrevious() {
    const store = this.props.store
    dispatchPrevMatchDay(store)
    this.updateMatchs()
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
      <SelectNavigator
        data={relevantMatchDays}
        selected={state.selectedMatchDay}
        onNext={this.onNext.bind(this)}
        onPrevious={this.onPrevious.bind(this)}
        onSelect={this.onSelect.bind(this)}
      />
    )
  }
}

export default MatchdayNavigator
