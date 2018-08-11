import * as React from 'react'
import { Component } from 'react'
import {
  dispatchSelectLeague,
  dispatchFetchYears,
  dispatchFetchMatchDays,
  dispatchSelectMatchDay,
  dispatchFetchMatchs,
  dispatchSelectYear,
} from '../actions/ActionBuilderWithStore'
import {
  areSelectedMatchDaysPresent,
  areSelectedMatchsPresent,
} from '../utils/storeHelpers'
import ListNavigator from './ListNavigator'
import { getYears } from '../utils/filter'

class Navbar extends Component {
  update() {
    this.forceUpdate()
  }

  componentWillMount() {
    this.unsubscribe = this.props.store.subscribe(this.update.bind(this))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  async leagueChange(event) {
    console.log(event.target.id)
    const store = this.props.store
    let state = store.getState()
    dispatchSelectLeague(store, event.target.id)
    dispatchFetchYears(store, event.target.id)

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

  async yearChange(id) {
    const store = this.props.store
    let state = store.getState()
    const year = parseInt(id, 10)
    dispatchSelectYear(store, state.selectedLeague, year)
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
    const store = this.props.store
    const state = store.getState()
    const relevantYears = getYears(state)

    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">
          {state.selectedLeague}
        </a>
        <ListNavigator
          buttonStyles={'btn-sm btn-light'}
          bgStyles={'btn-light'}
          selected={state.selectedYear}
          data={relevantYears}
          onSelect={this.yearChange.bind(this)}
        />
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            {state.leagues.map((l) => (
              <li
                className={`nav-item ${
                  l.id === state.selectedLeague ? 'active' : ''
                }`}
                key={l.id}
              >
                <a
                  className="nav-link"
                  href="#"
                  id={l.id}
                  onClick={this.leagueChange.bind(this)}
                >
                  {l.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    )
  }
}
export default Navbar
