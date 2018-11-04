import * as React from 'react'
import { Component } from 'react'
import './App.css'

import Matchs from './Matchs'
import MatchdayNavigator from '../components/MatchdayNavigator'

import { dispatchFetchInitial } from '../actions/ActionBuilderWithStore'
import { getSelectedMatchs } from '../utils/filter'
import { getIsLoading } from '../reducers/selectors/uiSelector'
import { getAllTeams } from '../reducers/selectors/modelSelector'
import { RefreshCurrentMatchDayButton } from './RefreshCurrentMatchDayButton'
import { MatchDayOptionsButton } from './MatchDayOptionsButton'
import { MatchDayViewSettings } from './MatchDayViewSettings'


import LoadingPage from './LoadingPage'
import Storage from './Storage'
import { getSeasonInfo } from '../utils/seasonInfo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PercentageButton } from '../components/PercentageButton';

import * as actionBuilder from '../actions/ActionBuilder'

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
    if (getIsLoading(state)) return <LoadingPage />
    if (state.ui.menuId === 'storage') return <Storage />

    console.log('render normal')
    const relevantMatchs = getSelectedMatchs(state)
    const teams = getAllTeams(state)
    const seasonInfo = getSeasonInfo(state)
    const showPercentage = state.ui.showPercentage
    return (
      <div className="container.fluid">
        <div className="row justify-content-center">
          <div className="col">
            <div
              className="btn-toolbar"
              role="toolbar"
              aria-label="Toolbar with button groups"
            >
                      <div className="btn-group" role="group" aria-label="Third group">
            <MatchDayViewSettings />
          </div>
              <div className="btn-group" role="group" aria-label="Third group">
                <MatchDayOptionsButton />
              </div>

              <MatchdayNavigator store={store} />
              <div className="btn-group" role="group" aria-label="Third group">
         <PercentageButton
          state={state}
          onClick={(s) => this.props.store.dispatch(actionBuilder.showPercentage(!s.ui.showPercentage))}
          />
          </div>
              <div className="btn-group" role="group" aria-label="Third group">
                <RefreshCurrentMatchDayButton />
              </div>
            </div>
        <div className="container-fluid">
          <div className="row">
            <Matchs
              matchs={relevantMatchs}
              teams={teams}
              seasonInfo={seasonInfo}
              showPercentage={showPercentage}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default App
