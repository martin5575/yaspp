import * as React from 'react'
import { Component } from 'react'
import Matchs from './Matchs'
import DropDown from '../components/DropDown'

import {
  dispatchFetchAll,
  dispatchFetchLeagues,
  dispatchFetchTeams,
  dispatchFetchMatchDays,
  dispatchFetchMatchs,
  dispatchFetchYears,
  dispatchNextMatchDay,
  dispatchPrevMatchDay,
  dispatchSelectMatchDay,
  dispatchSelectLeague,
  dispatchSelectYear,
} from '../actions/ActionBuilderWithStore'

import {
  areSelectedMatchsPresent,
  areSelectedMatchDaysPresent,
} from '../utils/storeHelpers'
import { getMatchs, getYears, getMatchDays } from '../utils/filter'

class App extends Component {
  constructor(props) {
    super(props)
    this.unsubscribe = this.props.store.subscribe(this.update.bind(this))
  }

  prevMatchDay = 'prevMatchDay'
  nextMatchDay = 'nextMatchDay'
  selectMatchDay = 'selectMatchDay'

  update() {
    this.forceUpdate()
  }

  async componentDidMount() {
    const store = this.props.store
    dispatchFetchAll(store)
  }

  async selectionChange(event) {
    const store = this.props.store
    let state = store.getState()
    if (event.target.id === 'league') {
      dispatchSelectLeague(store, event.target.value)
      dispatchFetchYears(store, event.target.value)
    }
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
  render() {
    const state = this.props.store.getState()
    if (state.isInitializing) {
      return <h2>Intializing...</h2>
    }
    if (state.isLoadingLeagues) {
      return <h2>Loading Leagues...</h2>
    }
    if (state.isLoadingYears) {
      return <h2>Loading Years...</h2>
    }
    if (state.isLoadingAllMatchDays) {
      return <h2>Loading Matchdays...</h2>
    }
    if (state.isLoadingTeams) {
      return <h2>Loading Teams...</h2>
    }
    if (state.isLoadingMatchDay) {
      return <h2>Loading Matchs...</h2>
    }
    console.log('render normal')
    const relevantYears = getYears(state)
    const relevantMatchDays = getMatchDays(state)
    const relevantMatchs = getMatchs(state)
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-7">
            <DropDown
              value={state.selectedLeague}
              className="form-control dropdown"
              onChange={this.selectionChange.bind(this)}
              id="league"
              data={state.leagues}
            />
          </div>
          <div className="col-xs-5">
            <DropDown
              value={state.selectedYear}
              className="form-control dropdown"
              onChange={this.selectionChange.bind(this)}
              id="year"
              data={relevantYears}
            />
          </div>
        </div>
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
        <div className="row">
          <Matchs matchs={relevantMatchs} teams={state.teams} />
        </div>
      </div>
    )
  }
}

export default App
