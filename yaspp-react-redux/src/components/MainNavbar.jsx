import * as React from 'react'
import { useEffect, useState } from 'react'
import {
  dispatchSelectYear,
  updateMatchDaysIfNecessary,
} from '../actions/ActionBuilderWithStore'
import ListNavigator from './ListNavigator'
import { getSelectedYears } from '../utils/filter'
import {
  getSelectedLeague,
  getSelectedYear,
} from '../reducers/selectors/uiSelector'
import MainMenu from './MainMenu'
import { Navbar, NavbarBrand } from 'reactstrap'

function MainNavbar({ store }) {
  const [, setTick] = useState(0)

  useEffect(() => {
    const unsubscribe = store.subscribe(() => setTick((t) => t + 1))
    return () => unsubscribe && unsubscribe()
  }, [store])

  async function yearChange(id) {
    const state = store.getState()
    const year = parseInt(id, 10)
    const selectedLeague = getSelectedLeague(state)
    dispatchSelectYear(store, selectedLeague, year)
    updateMatchDaysIfNecessary(store)
  }

  const state = store.getState()
  const relevantYears = getSelectedYears(state)
  const selectedLeague = getSelectedLeague(state)
  const selectedYear = getSelectedYear(state)

  return (
    <Navbar>
      <NavbarBrand href="/">{selectedLeague}</NavbarBrand>
      <ListNavigator
        buttonStyles={'btn-sm btn-light'}
        bgStyles={'btn-light'}
        selected={selectedYear}
        data={relevantYears}
        onSelect={yearChange}
      />
      <MainMenu store={store} />
    </Navbar>
  )
}

export default MainNavbar
