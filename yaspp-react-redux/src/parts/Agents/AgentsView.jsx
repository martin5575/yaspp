import { useState, useEffect } from 'react';
import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Badge, Button, Label, Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap'
import { calcStats, aggregateSeasonInfo } from '../../stats/seasonInfo';
import { IconButton } from '../../components/IconButton';
import { ButtonGroup, ButtonToolbar } from 'reactstrap';
import _, { groupBy, sortBy } from 'lodash';
import { getKeys, getShort } from '../../stats/statsType'
import BarChartRace from './BarChartRace';
import MultiSeasonView from './MultiSeasonView';
import { getTopTippResult, getPointsForTipp } from '../../kicktipp';
import TotalPointsView from './TotalPointsView';
import ChartDetailsView from './ChartDetailsView';
import Legend from './Legend';
import { getSelectedYears } from '../../utils/filter';
import ListNavigator from '../../components/ListNavigator';
import { dispatchFetchAllMatchs } from '../../actions/ActionBuilderWithStore';
import { getMatchDays } from '../../services';

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

function getBarChartData(performances) {
  const barChartData = performances.map(x => {
    return {
      name: getShort(x.agent),
      values: x.performance.map(x => x.points)
    };
  });
  barChartData.forEach(row => {
    const accumulatedValues = row.values.reduce((acc, x) => {
      acc.push(acc[acc.length - 1] + x);
      return acc;
    }, [0]);
    row.values = accumulatedValues.slice(1);
  });
  return barChartData;
}

function getDateValues(state, selectedLeague, selectedYear, performances) {
  const matchDays = state.model.matchDays?.filter(x => x.league === selectedLeague && x.year === selectedYear);
  const matchDayLkp = _.keyBy(matchDays, x => x.id);
  const dateValues = performances[0].performance.map(x => matchDayLkp[x.matchDayId]?.name ?? x.matchDayId);
  return dateValues;
}

const viewModes = [
  {label: "Total Points", id: "total-points"},
  {label: "Running Points", id: "running-points"} ,
  {label: "Chart Details", id: "details"},
  {label: "Multi Season", id: "multi-season"}
]

function AgentsView(props) {
  const store = props.store;
  const state = store.getState()
  console.log("AgentsView", state)

  const selectedLeague = state.ui.selectedLeague;
  const relevantYears = getSelectedYears(state)
  const initialYear = state.ui.selectedYear

  const [visible, setVisible] = useState(false)
  const [viewMode, setViewMode] = useState(0)
  const [year, setYear] = useState(initialYear)
  const [detailsCumulative, setDetailsCumulative] = useState(false)

  // Keep local year in sync with global selection (e.g., Navbar changes)
  useEffect(() => {
    if (state.ui.selectedYear && state.ui.selectedYear !== year) {
      setYear(state.ui.selectedYear)
    }
  }, [state.ui.selectedYear])

  // Fetch data when league/year changes
  useEffect(() => { 
    if (selectedLeague && year &&  year!==state.model.currentMatchDay.year) {
      const matchDays = state.model.matchDays?.filter(x => x.league === selectedLeague && x.year === year);
      const matchsPerMatchDay = groupBy(state.model.matchs?.filter(x=>x.league === selectedLeague && x.year === year), x=>x.matchDayId)
      if (matchDays.length!= Object.keys(matchsPerMatchDay).length) {
        dispatchFetchAllMatchs(props.store, selectedLeague, year)
      }
    }
  }, [year, selectedLeague])

  const updateViewMode = (step) => setViewMode((viewMode + 4 + step) % 4)

  const league = state.model.leagues.find(x=>x.id===selectedLeague);
  const matchs = state.model.matchs.filter(x=>x.league===selectedLeague && x.year===year && x.isFinished)
  sortBy(matchs, x=>x.matchDateTime)
  const agents = [...getKeys()]
  const performances = calculatePerformances(agents, matchs)

  const barChartData = getBarChartData(performances);
  const dateValues = getDateValues(state, selectedLeague, year, performances);
  const detailsData = performances.map(x => ({
      name: getShort(x.agent),
      values: x.performance.map(x => x.points)
  }));
  const selectedViewMode = viewModes[viewMode]
  const legendNames = detailsData.map(d => d.name)

  // Visible selection: default to top-3 by total points
  const defaultTop3 = legendNames
    .map((n, idx) => ({ name: n, sum: performances[idx]?.sum ?? 0 }))
    .sort((a, b) => b.sum - a.sum)
    .slice(0, 3)
    .map(x => x.name)
  const [visibleNames, setVisibleNames] = useState(new Set(defaultTop3))
  useEffect(() => {
    // Reset selection when dataset changes (league/year)
    const nextTop3 = legendNames
      .map((n, idx) => ({ name: n, sum: performances[idx]?.sum ?? 0 }))
      .sort((a, b) => b.sum - a.sum)
      .slice(0, 3)
      .map(x => x.name)
    setVisibleNames(new Set(nextTop3))
  }, [selectedLeague, year])

  const toggleVisible = (name) => {
    setVisibleNames(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const filteredDetailsData = detailsData.filter(d => visibleNames.has(d.name))

  // Multi-season data: aggregate finished matches by year for current league
  const seasonsAll = [...new Set((state.model.matchDays||[]).filter(x=>x.league===selectedLeague).map(x=>x.year))].sort((a,b)=>a-b)
  const seasonsForLeague = seasonsAll.slice(-5)
  const multiSeasonSeries = agents.map(agent => {
    const perYear = seasonsForLeague.map(yr => {
      const m = state.model.matchs.filter(x=>x.league===selectedLeague && seasonsForLeague.includes(x.year) && x.year===yr && x.isFinished)
      // reuse existing calc pipeline
      const perf = calculatePerformances([agent], m)[0]
      return perf?.sum || 0
    })
    return { name: getShort(agent), values: perYear }
  })

  // Ensure data is loaded for the 5 selected seasons when viewing multi-season
  useEffect(() => {
    if (selectedLeague && selectedViewMode.id === 'multi-season') {
      seasonsForLeague.forEach(yr => {
        const matchDays = (state.model.matchDays||[]).filter(x => x.league === selectedLeague && x.year === yr)
        const matchesByDay = groupBy(state.model.matchs?.filter(x=>x.league===selectedLeague && x.year===yr && x.isFinished), x=>x.matchDayId)
        if (!matchDays || matchDays.length !== Object.keys(matchesByDay||{}).length) {
          dispatchFetchAllMatchs(props.store, selectedLeague, yr)
        }
      })
    }
  }, [selectedLeague, selectedViewMode.id, seasonsForLeague.join(',')])

  return (<div>
      <Button
      className="btn btn-secondary"
      onClick={() => setVisible(!visible)}
    >
      <FontAwesomeIcon icon="robot" />
    </Button>
    <Offcanvas fade isOpen={visible} toggle={() => setVisible(!visible)} direction='top' backdrop={false} style={{'height': "100%"}}>
      <OffcanvasHeader toggle={() => setVisible(!visible)}>
        {league?.name}
        <ListNavigator
        buttonStyles={'btn-sm btn-light'}
        bgStyles={'btn-light'}
        selected={year}
        data={relevantYears}
        onSelect={(year) => setYear( parseInt(year))}
      />
      </OffcanvasHeader>
      <OffcanvasBody>
        <div className='d-flex justify-content-center mb-2'>
          <div className='btn-group' role='group' aria-label='Select view'>
            <button
              type='button'
              className={`btn btn-sm ${viewMode===0 ? 'btn-secondary' : 'btn-outline-secondary'}`}
              aria-pressed={viewMode===0}
              onClick={()=>setViewMode(0)}
              title='Show total points table'
            >
              Total Points
            </button>
            <button
              type='button'
              className={`btn btn-sm ${viewMode===1 ? 'btn-secondary' : 'btn-outline-secondary'}`}
              aria-pressed={viewMode===1}
              onClick={()=>setViewMode(1)}
              title='Show running points (bar race)'
            >
              Running Points
            </button>
            <button
              type='button'
              className={`btn btn-sm ${viewMode===2 ? 'btn-secondary' : 'btn-outline-secondary'}`}
              aria-pressed={viewMode===2}
              onClick={()=>setViewMode(2)}
              title='Show detailed chart'
            >
              Chart Details
            </button>
            <button
              type='button'
              className={`btn btn-sm ${viewMode===3 ? 'btn-secondary' : 'btn-outline-secondary'}`}
              aria-pressed={viewMode===3}
              onClick={()=>setViewMode(3)}
              title='Show multi-season performance'
            >
              Multi Season
            </button>
          </div>
        </div>
  <Legend names={legendNames} selectedNames={visibleNames} onToggle={toggleVisible} />
        {state.ui.isLoadingMatchs && <div>Loading...</div>}
  {!state.ui.isLoadingMatchs && selectedViewMode.id==="running-points" && <BarChartRace id='running-points-chart' data={barChartData} dateValues={dateValues} ></BarChartRace>}
  {!state.ui.isLoadingMatchs &&selectedViewMode.id==="total-points" && <TotalPointsView id='total-points-chart' data={performances} ></TotalPointsView>}
  {!state.ui.isLoadingMatchs &&selectedViewMode.id==="details" && (
    <>
      <div className='d-flex justify-content-end mb-2' style={{ gap: 6 }}>
        <button
          type='button'
          className='btn btn-sm'
          aria-pressed={!detailsCumulative}
          onClick={() => setDetailsCumulative(false)}
          title='Show per-matchday points'
          style={{
            padding: '2px 8px',
            borderRadius: 8,
            border: '1px solid #ddd',
            background: !detailsCumulative ? 'rgba(0,0,0,0.04)' : 'transparent',
            color: '#222'
          }}
        >
          Points
        </button>
        <button
          type='button'
          className='btn btn-sm'
          aria-pressed={detailsCumulative}
          onClick={() => setDetailsCumulative(true)}
          title='Show cumulative points'
          style={{
            padding: '2px 8px',
            borderRadius: 8,
            border: '1px solid #ddd',
            background: detailsCumulative ? 'rgba(0,0,0,0.04)' : 'transparent',
            color: '#222'
          }}
        >
          Cumulative
        </button>
      </div>
      <ChartDetailsView id='details-chart' data={filteredDetailsData} dateValues={dateValues} isCumulative={detailsCumulative} />
    </>
  )}
  {!state.ui.isLoadingMatchs && selectedViewMode.id==="multi-season" && (
    <MultiSeasonView id='multi-season-chart' seasons={seasonsForLeague} series={multiSeasonSeries} />
  )}
      </OffcanvasBody>
    </Offcanvas>
  </div>
  );
}

export default AgentsView
