import * as React from 'react'
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

function MatchdayNavigator({ store }) {
  const state = store.getState()
  const relevantMatchDays = getSelectedMatchDays(state)
  const selectedMatchDay = getSelectedMatchDay(state)

  function onSelect(id) {
    dispatchSelectMatchDay(store, parseInt(id, 10))
    if (!areSelectedMatchsPresent(store)) {
      const st = store.getState()
      dispatchFetchMatchs(
        store,
        getSelectedLeague(st),
        getSelectedYear(st),
        getSelectedMatchDay(st)
      )
    }
  }

  return (
    <ListNavigator
      data={relevantMatchDays}
      selected={selectedMatchDay}
      onSelect={onSelect}
    />
  )
}

export default MatchdayNavigator
