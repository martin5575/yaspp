import * as React from 'react'
import { Component } from 'react'
import {
  dispatchSelectLeague,
  dispatchFetchYears,
  dispatchSelectYear,
  updateMatchDaysIfNecessary,
  dispatchSwitchMenu,
} from '../actions/ActionBuilderWithStore'
import ListNavigator from './ListNavigator'
import { getSelectedYears } from '../utils/filter'
import { getAllLeagues } from '../reducers/selectors/modelSelector'
import {
  getSelectedLeague,
  getSelectedYear,
} from '../reducers/selectors/uiSelector'

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
    dispatchSwitchMenu(store, 'matchs')
    dispatchSelectLeague(store, event.target.id)
    dispatchFetchYears(store, event.target.id)

    updateMatchDaysIfNecessary(store)
  }

  async yearChange(id) {
    const store = this.props.store
    let state = store.getState()
    const year = parseInt(id, 10)
    const selectedLeague = getSelectedLeague(state)
    dispatchSelectYear(store, selectedLeague, year)
    updateMatchDaysIfNecessary(store)
  }

  selectMenu(event) {
    console.log(event.target.id)
    const store = this.props.store
    dispatchSwitchMenu(store, event.target.id)
  }

  render() {
    const store = this.props.store
    const state = store.getState()
    const relevantYears = getSelectedYears(state)
    const leagues = getAllLeagues(state)
    const selectedLeague = getSelectedLeague(state)
    const selectedYear = getSelectedYear(state)
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="/">
          {selectedLeague}
        </a>
        <ListNavigator
          buttonStyles={'btn-sm btn-light'}
          bgStyles={'btn-light'}
          selected={selectedYear}
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
          <span className="navbar-text">
            <b>Liga</b>
          </span>
          <ul className="navbar-nav mr-auto">
            {leagues.map((l) => (
              <li
                className={`nav-item ${
                  l.id === selectedLeague ? 'active' : ''
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
          <span className="navbar-text">
            <b>Einstellungen</b>
            <ul className="navbar-nav mr-auto">
              <li className={`nav-item`} key="storage">
                <a
                  className="nav-link"
                  href="#"
                  id="storage"
                  onClick={this.selectMenu.bind(this)}
                >
                  Speicher
                </a>
              </li>
            </ul>
          </span>
        </div>
      </nav>
    )
  }
}
export default Navbar
