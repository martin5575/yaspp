import { useState } from 'react';
import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap'
import { calcStats, aggregateSeasonInfo } from '../../stats/seasonInfo';
import { IconButton } from '../../components/IconButton';
import { ButtonGroup, ButtonToolbar } from 'reactstrap';
import _, { sortBy } from 'lodash';
import { getKeys, getShort } from '../../stats/statsType'
import BarChartRace from './BarChartRace';
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
      const topTipp = stats.isFixed ? {
          fullTimeHome: stats.home,
          fullTimeAway: stats.away
      } : getTopTippResult(stats.home, stats.away, numberOfGoals)

        return getPointsForTipp(match.fullTimeHome, match.fullTimeAway, topTipp.fullTimeHome, topTipp.fullTimeAway)
      });
      const sum = _.sum(tippPoints)
      return { points: sum, matchDayId: simulationDay.matchDayId }
    });
    return {
      agent: agent,
      performance: performance,
      sum: _.sum(performance.map(x=>x.points))
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

  const matchDays = state.model.matchDays?.filter(x=>x.league===selectedLeague && x.year===selectedYear)
  const matchDayLkp = _.keyBy(matchDays, x=>x.id)
  console.log(matchDayLkp)
  const barChartData = performances.map(x=> {
    return {
      name: getShort(x.agent),
      values: x.performance.map(x=>x.points)
    }
  })
  barChartData.forEach(row => {
    const accumulatedValues = row.values.reduce((acc, x) => {
      acc.push(acc[acc.length - 1] + x)
      return acc
    }, [0]) 
    row.values = accumulatedValues.slice(1)
    delete row.value
  });

  const dateValues = performances[0].performance.map(x=>matchDayLkp[x.matchDayId]?.name ?? x.matchDayId)
  console.log(barChartData)
  console.log(dateValues)

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
        <BarChartRace id='test-id' data={barChartData} dateValues={dateValues} ></BarChartRace>
      </OffcanvasBody>
    </Offcanvas>
  </div>
  );
}

export default AgentsView
