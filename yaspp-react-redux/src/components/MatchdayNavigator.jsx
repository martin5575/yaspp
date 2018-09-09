import * as React from 'react'
import { Component } from 'react'
import ListNavigator from './ListNavigator'

import {
  dispatchFetchMatchs,
  dispatchSelectMatchDay,
} from '../actions/ActionBuilderWithStore'

import { areSelectedMatchsPresent } from '../utils/storeHelpers'
import { getSelectedMatchDays } from '../utils/filter'
import {
  getSelectedLeague,
  getSelectedYear,
  getSelectedMatchDay,
} from '../reducers/selectors/uiSelector'

class MatchdayNavigator extends Component {
  onSelect(id) {
    const store = this.props.store
    dispatchSelectMatchDay(store, parseInt(id, 10))
    this.updateMatchs()
  }

  updateMatchs() {
    const store = this.props.store
    if (!areSelectedMatchsPresent(store)) {
      const state = store.getState()
      dispatchFetchMatchs(
        store,
        getSelectedLeague(state),
        getSelectedYear(state),
        getSelectedMatchDay(state)
      )
    }
  }

  render() {
    const store = this.props.store
    const state = store.getState()
    const relevantMatchDays = getSelectedMatchDays(state)
    const selectedMatchDay = getSelectedMatchDay(state)
    return (
      <ListNavigator
        data={relevantMatchDays}
        selected={selectedMatchDay}
        onSelect={this.onSelect.bind(this)}
      />
    )
  }
}

export default MatchdayNavigator
