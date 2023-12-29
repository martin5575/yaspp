import { useState } from 'react';
import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap'
import { calcStats, aggregateSeasonInfo } from '../../stats/seasonInfo';
import { IconButton } from '../../components/IconButton';
import { ButtonGroup, ButtonToolbar } from 'reactstrap';
import { sortBy } from 'lodash';
import { getKeys, getShort } from '../../stats/statsType'
import BarChartRace from './BarChartRace2';
import { getTopTippResult, getPointsForTipp } from '../../kicktipp';

const logoSize = 40
const numberOfGoals = [0,1,2,3,4,5,6]

function getDataForSimulation(matchs) {
  const matchDays = [...new Set(matchs.map(x=>x.matchDayId))]
  const matchDaysSorted = sortBy(matchDays, x=>x)

  return matchDaysSorted.map(matchDayId => {
    const matchsUntilMatchDay = matchs.filter(x=>x.matchDayId<matchDayId)
    const seasonInfoUntilMatchDay = aggregateSeasonInfo(matchsUntilMatchDay)
    const matchsOfMatchDay = matchs.filter(x=>x.matchDayId===matchDayId);
    return {
      matchDayId: matchDayId,
      matchs: matchsOfMatchDay,
      simulationData: {
        matchsUntil: matchsUntilMatchDay,
        seasonInfo: seasonInfoUntilMatchDay
      }
    }
  })
}

function calculatePerformances(agents, matchs) {
  const data = getDataForSimulation(matchs)
  console.log(data)
  return agents.map(agent => {
    const performance = data.map(simulationDay => {
      const tippPoints = simulationDay.matchs.map(match => {
        const stats = calcStats(simulationDay.simulationData.seasonInfo, match.teamHomeId, match.teamAwayId, agent)
        const topTipp = getTopTippResult(stats.home, stats.away, numberOfGoals)
        return getPointsForTipp(match.fullTimeHome, match.fullTimeAway, topTipp.fullTimeHome, topTipp.fullTimeAway)
      });
      const sum = tippPoints.reduce((a,b)=>a+b, 0)
      return sum
    });
    return {
      agent: agent,
      performance: performance,
      sum: performance.reduce((a,b)=>a+b, 0)
    }
  })
}

function AgentsView(props) {
  const [visible, setVisible] = useState(false)

  const store = props.store;
  const state = store.getState()
  console.log(state)
  const selectedLeague = state.ui.selectedLeague;
  const selectedYear = state.ui.selectedYear;
  const league = state.model.leagues.find(x=>x.id===selectedLeague);
  const matchs = state.model.matchs.filter(x=>x.league===selectedLeague && x.year===selectedYear && x.isFinished)
  sortBy(matchs, x=>x.matchDateTime)
  const agents = [...getKeys()]
  const performances = calculatePerformances(agents, matchs)
  console.log(performances)

  const barChartData = performances.map(x=> {
    return {
      name: getShort(x.agent),
      values: x.performance
    }
  })

  return (<div>
      <Button
      className="btn btn-secondary"
      onClick={() => setVisible(!visible)}
    >
      <FontAwesomeIcon icon="robot" />
    </Button>
    <Offcanvas fade isOpen={visible} toggle={() => setVisible(!visible)} direction='top' backdrop={false} style={{'height': "100%"}}>
      <OffcanvasHeader toggle={() => setVisible(!visible)}>
        {league?.name} {selectedYear}
      </OffcanvasHeader>
      <OffcanvasBody>
        <ButtonToolbar>
          <ButtonGroup>
            <IconButton icon="caret-left" style={{'height': logoSize+"px", 'width': logoSize+"px"}} ></IconButton>
            <IconButton icon="caret-right" style={{'height': logoSize+"px", 'width': logoSize+"px"}} ></IconButton>
          </ButtonGroup>
        </ButtonToolbar>
        <div className="text-center"><small>{state.model.currentMatchDay?.name}</small></div>        
        <BarChartRace id='test-id' data={barChartData} ></BarChartRace>
      </OffcanvasBody>
    </Offcanvas>
  </div>
  );
}

export default AgentsView
