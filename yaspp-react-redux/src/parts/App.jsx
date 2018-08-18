import * as React from 'react'
import { Component } from 'react'

import Matchs from './Matchs'
import MatchdayNavigator from '../components/MatchdayNavigator'

import { dispatchFetchInitial } from '../actions/ActionBuilderWithStore'
import { getSelectedMatchs } from '../utils/filter'
import {
  getIsInitializing,
  getIsLoadingLeagues,
  getIsLoadingYears,
  getIsLoadingAllMatchDays,
  getIsLoadingTeams,
  getIsLoadingMatchDay,
} from '../reducers/selectors/uiSelector'
import { getAllTeams } from '../reducers/selectors/modelSelector'
import { RefreshCurrentMatchDayButton } from './RefreshCurrentMatchDayButton'

class App extends Component {
  update() {
    this.forceUpdate()
  }

  componentWillMount() {
    this.unsubscribe = this.props.store.subscribe(this.update.bind(this))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  async componentDidMount() {
    const store = this.props.store
    dispatchFetchInitial(store)
  }

  render() {
    const store = this.props.store
    const state = store.getState()
    if (getIsInitializing(state)) {
      return <h2>Intializing...</h2>
    }
    if (getIsLoadingLeagues(state)) {
      return <h2>Loading Leagues...</h2>
    }
    if (getIsLoadingYears(state)) {
      return <h2>Loading Years...</h2>
    }
    if (getIsLoadingAllMatchDays(state)) {
      return <h2>Loading Matchdays...</h2>
    }
    if (getIsLoadingTeams(state)) {
      return <h2>Loading Teams...</h2>
    }
    if (getIsLoadingMatchDay(state)) {
      return <h2>Loading Matchs...</h2>
    }
    console.log('render normal')
    const relevantMatchs = getSelectedMatchs(state)
    const teams = getAllTeams(state)
    return (
      <div className="container">
        <div className="row">
          <MatchdayNavigator store={store} />
          <RefreshCurrentMatchDayButton />
        </div>
        <div className="row">
          <Matchs matchs={relevantMatchs} teams={teams} />
        </div>
      </div>
    )
  }
}

export default App
