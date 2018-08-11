import * as React from 'react'
import { Component } from 'react'

import Matchs from './Matchs'
import MatchdayNavigator from '../components/MatchdayNavigator'

import { dispatchFetchAll } from '../actions/ActionBuilderWithStore'
import { getMatchs } from '../utils/filter'

class App extends Component {
  constructor(props) {
    super(props)
  }

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
    dispatchFetchAll(store)
  }

  render() {
    const store = this.props.store
    const state = store.getState()
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
    const relevantMatchs = getMatchs(state)
    return (
      <div className="container">
        <div className="row">
          <MatchdayNavigator store={store} />
        </div>
        <div className="row">
          <Matchs matchs={relevantMatchs} teams={state.teams} />
        </div>
      </div>
    )
  }
}

export default App
