import * as React from 'react'
import { Component } from 'react'
import './App.css'

import Matchs from './Matchs'
import Table from './Table'
import MatchdayNavigator from '../components/MatchdayNavigator'

import { dispatchFetchInitial } from '../actions/ActionBuilderWithStore'
import { getSelectedMatchs } from '../utils/filter'
import { getIsLoading } from '../reducers/selectors/uiSelector'
import { getAllTeams } from '../reducers/selectors/modelSelector'
import { RefreshCurrentMatchDayButton } from './RefreshCurrentMatchDayButton'
import { MatchDayOptionsButton } from './MatchDayOptionsButton'
import  SingleMatchView  from './SingleMatchView'

import LoadingPage from './LoadingPage'
import Storage from './Storage'
import { getSeasonInfo } from '../stats/seasonInfo'
import { PercentageButton } from '../components/PercentageButton'

import * as actionBuilder from '../actions/ActionBuilder'
import { ButtonGroup, ButtonToolbar } from 'reactstrap'
import AgentsView from './Agents/AgentsView'

class App extends Component {
  update() {
    this.forceUpdate()
  }

  componentDidMount() {
    this.unsubscribe = this.props.store.subscribe(this.update.bind(this))
    const store = this.props.store
    dispatchFetchInitial(store)
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe()
  }

  render() {
    const store = this.props.store
    const state = store.getState()
    if (getIsLoading(state)) return <LoadingPage />
    if (state.ui.menuId === 'storage') return <Storage />

    const relevantMatchs = getSelectedMatchs(state)
    const teams = getAllTeams(state)
    const seasonInfo = getSeasonInfo(state)
    const showPercentage = state.ui.showPercentage
    const selectedModelId = state.ui.selectedModelId
    const probabilityDetailsMatchId = state.ui.probabilityDetailsMatchId
    return (
      <div className="container.fluid">
        <div className="row justify-content-center m-0 p-0">
          <ButtonToolbar className='m-0 p-0'>
            <ButtonGroup>
              <SingleMatchView store={store} teams={teams} seasonInfo={seasonInfo} relevantMatchs={relevantMatchs} selectedModelId={selectedModelId} />
              <MatchDayOptionsButton selectedModelId={selectedModelId} />
              <AgentsView store={store} />
            </ButtonGroup>
            <MatchdayNavigator store={store} />
            <ButtonGroup>
              <PercentageButton
                  state={state}
                  onClick={(s) =>
                    this.props.store.dispatch(
                      actionBuilder.showPercentage(!s.ui.showPercentage)
                    )
                  }
                />
            </ButtonGroup>
            <ButtonGroup>
              <RefreshCurrentMatchDayButton />
            </ButtonGroup>
          </ButtonToolbar>
          </div>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-8 no-pad-right">
                <Matchs
                  matchs={relevantMatchs}
                  teams={teams}
                  seasonInfo={seasonInfo}
                  showPercentage={showPercentage}
                  selectedModelId={selectedModelId}
                  probabilityDetailsMatchId={probabilityDetailsMatchId}
              toggleProbabilityDetails={(matchId) => { 
                this.props.store.dispatch(
                  actionBuilder.toggleProbabilityDetails(matchId)
                )  }}
            />
              </div>
              <div className="col-md-3">
                <Table 
                  teams={teams}
                  seasonInfo={seasonInfo}
                  matchs={relevantMatchs}
                  selectedModelId={selectedModelId}
                  showAvg={showPercentage}
                  />
              </div>
            </div>
          </div>
        </div>
    )
  }
}

export default App
