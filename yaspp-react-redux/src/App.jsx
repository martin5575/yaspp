import * as React from 'react'
import { Component } from 'react'
import Matchs from './Matchs'

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
} from './ActionBuilderWithStore'

import {
  areSelectedMatchsPresent,
  areSelectedMatchDaysPresent,
} from './storeHelpers'
import { getMatchs, getYears, getMatchDays } from './filter'

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
      <div className="container col-xs-8 col-xs-2-push">
        <div className="row">
          <div className="col-xs-5">
            <select
              value={state.selectedLeague}
              className="form-control dropdown"
              onChange={this.selectionChange.bind(this)}
              id="league"
            >
              {state.leagues.map((l) => (
                <option value={l.id} key={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-5">
            <select
              value={state.selectedYear}
              className="form-control dropdown"
              onChange={this.selectionChange.bind(this)}
              id="year"
            >
              {relevantYears.map((y) => (
                <option value={y.id} key={y.id}>
                  {y.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-1">
            <button
              className="btn form-control"
              id={this.prevMatchDay}
              onClick={this.matchDayChange.bind(this)}
            >
              &lt;
            </button>
          </div>
          <div className="col-xs-8">
            <select
              value={state.selectedMatchDay}
              className="form-control dropdown"
              onChange={this.matchDayChange.bind(this)}
              id={this.selectMatchDay}
            >
              {relevantMatchDays.map((g) => (
                <option value={g.id} key={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-xs-1">
            <button
              className="btn form-control"
              id={this.nextMatchDay}
              onClick={this.matchDayChange.bind(this)}
            >
              &gt;
            </button>
          </div>
        </div>
        <div className="row col-xs-8">
          {state.matchs.length > 0
            ? state.matchs[0].LeagueName
            : 'Spieltaginfo'}
        </div>
        <Matchs matchs={relevantMatchs} teams={state.teams} />
      </div>
    )
  }
}

export default App
