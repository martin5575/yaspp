import * as React from 'react'
import { useEffect, useState } from 'react'
import {
  dispatchSelectYear,
  updateMatchDaysIfNecessary,
} from '../actions/ActionBuilderWithStore'
import ListNavigator from './ListNavigator'
import YearSelector from './YearSelector'
import { getSelectedYears, getSelectedMatchs } from '../utils/filter'
import {
  getSelectedLeague,
  getSelectedYear,
} from '../reducers/selectors/uiSelector'
import MainMenu from './MainMenu'
import { Navbar, NavbarBrand } from 'reactstrap'
import SingleMatchView from '../parts/SingleMatchView'
import AgentsView from '../parts/Agents/AgentsView'
import { getAllTeams } from '../reducers/selectors/modelSelector'
import { getSeasonInfo } from '../stats/seasonInfo'
import './TopbarButtons.css'
import './Navbar.css'

function MainNavbar({ store }) {
  const [, setTick] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

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
  const relevantMatchs = getSelectedMatchs(state)
  const teams = getAllTeams(state)
  const seasonInfo = getSeasonInfo(state)
  const selectedModelId = state.ui.selectedModelId

  return (
    <Navbar className='px-2 yaspp-top'>
      <div style={{ display: menuOpen ? 'none' : 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <NavbarBrand href="/">{selectedLeague}</NavbarBrand>
        <YearSelector years={relevantYears} selectedId={selectedYear} onSelect={yearChange} />
      </div>
      <div className='ms-auto d-flex align-items-center' style={{ gap: 4, whiteSpace: 'nowrap' }}>
        {/* Quick access buttons to open views */}
        <div className='d-flex align-items-center' style={{ gap: 4, visibility: menuOpen ? 'hidden' : 'visible' }}>
          <SingleMatchView
            store={store}
            teams={teams}
            seasonInfo={seasonInfo}
            relevantMatchs={relevantMatchs}
            selectedModelId={selectedModelId}
            triggerClass={'tb-btn btn btn-sm'}
          />
          <AgentsView store={store} triggerClass={'tb-btn btn btn-sm'} />
        </div>
        <MainMenu store={store} onOpenChange={setMenuOpen} />
      </div>
    </Navbar>
  )
}

export default MainNavbar
