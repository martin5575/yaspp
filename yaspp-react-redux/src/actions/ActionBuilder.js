import * as actions from './actions'

import * as service from '../services'
import * as mapper from '../services/mapOpenLigaDB'
import {
  existsMatchDay,
  existLeagues,
  existYears,
  existTeams,
  existMatchDays,
} from '../utils/filter'
import {
  getSelectedMatchDay,
  getSelectedLeague,
  getSelectedYear,
} from '../reducers/selectors/uiSelector'
import { dictionarize } from '../utils/listUtils'

/******************* SELECT in UI ******************/

function selectMatchDay(state, selectedMatchDay) {
  if (!existsMatchDay(state, selectedMatchDay))
    selectedMatchDay = getSelectedMatchDay(state)
  return {
    type: actions.SelectMatchDay,
    selectedMatchDay,
  }
}

function selectLeague(selectedLeague) {
  return {
    type: actions.SelectLeague,
    selectedLeague,
  }
}

function selectYear(selectedLeague, selectedYear) {
  return {
    type: actions.SelectYear,
    selectedLeague,
    selectedYear,
  }
}

/***************** MATCHDAYS  *********************/

function requestMatchDays(selectedLeague, selectedYear) {
  return {
    type: actions.RequestMatchDays,
    isLoadingMatchDays: true,
    selectedLeague,
    selectedYear,
  }
}

function receiveMatchDays(selectedLeague, selectedYear, json) {
  return {
    type: actions.ReceiveMatchDays,
    isLoadingMatchDays: false,
    selectedLeague,
    selectedYear,
    matchDays: json.map((x) =>
      mapper.mapMatchDay(x, selectedLeague, selectedYear)
    ),
  }
}

function fetchMatchDays(selectedLeague, selectedYear) {
  return function(dispatch) {
    dispatch(requestMatchDays(selectedLeague, selectedYear))
    return service
      .getMatchDays(selectedLeague, selectedYear)
      .then((json) =>
        dispatch(receiveMatchDays(selectedLeague, selectedYear, json))
      )
  }
}

/***************** MATCHS  *********************/

function requestMatchs(selectedLeague, selectedYear, selectedMatchDay) {
  return {
    type: actions.RequestMatchs,
    isLoadingMatchs: true,
    selectedLeague,
    selectedYear,
    selectedMatchDay,
  }
}

function receiveMatchs(selectedLeague, selectedYear, selectedMatchDay, json) {
  const teams = mapper.mapTeamFromMatchs(json)
  return {
    type: actions.ReceiveMatchs,
    isLoadingMatchs: false,
    selectedLeague,
    selectedYear,
    selectedMatchDay,
    matchs: json.map((x) => mapper.mapMatch(x, selectedLeague, selectedYear)),
    teams,
  }
}
function fetchMatchs(selectedLeague, selectedYear, selectedMatchDay) {
  return function(dispatch) {
    dispatch(requestMatchs(selectedLeague, selectedYear, selectedMatchDay))
    return service
      .getMatchs(selectedLeague, selectedYear, selectedMatchDay)
      .then((json) =>
        dispatch(
          receiveMatchs(selectedLeague, selectedYear, selectedMatchDay, json)
        )
      )
  }
}

/***************** TEAMS  *********************/

function requestTeams(selectedLeague, selectedYear) {
  return {
    type: actions.RequestTeams,
    isLoadingTeams: true,
    selectedLeague,
    selectedYear,
  }
}

function receiveTeams(selectedLeague, selectedYear, json) {
  const teamData = json.map((x) => mapper.mapTeam(x))
  const teams = dictionarize(teamData)
  const teamsByLeagueAndYear = teamData.map((x) => ({
    teamId: x.id,
    league: selectedLeague,
    year: selectedYear,
  }))

  return {
    type: actions.ReceiveTeams,
    isLoadingTeams: false,
    selectedLeague,
    selectedYear,
    teams,
    teamsByLeagueAndYear,
  }
}

function fetchTeams(selectedLeague, selectedYear) {
  return function(dispatch) {
    dispatch(requestTeams(selectedLeague, selectedYear))
    const promise = service.getTeams(selectedLeague, selectedYear)
    return (
      promise
        //.then(
        // response => response.json()
        //error => console.log('An error occurred.',   error)
        //)
        .then((json) =>
          dispatch(receiveTeams(selectedLeague, selectedYear, json))
        )
    )
  }
}

/***************** LEAGUES  *********************/

function requestLeagues() {
  return { type: actions.RequestLeagues, isLoadingLeagues: true }
}
function receiveLeagues(json) {
  return {
    type: actions.ReceiveLeagues,
    isLoadingLeagues: false,
    leagues: json.map((x) => x),
  }
}
function fetchLeagues() {
  return function(dispatch) {
    dispatch(requestLeagues())
    const leagues = service.getLeagues()
    dispatch(receiveLeagues(leagues))
  }
}

/***************** YEARS  *********************/

function requestYears(selectedLeague) {
  return {
    type: actions.RequestYears,
    isLoadingYears: true,
    selectedLeague,
  }
}
function receiveYears(selectedLeague, json) {
  const years = json.map((x) => x)
  let yearsByLeague = {}
  yearsByLeague[selectedLeague] = years
  return {
    type: actions.ReceiveYears,
    selectedLeague: selectedLeague,
    isLoadingYears: false,
    yearsByLeague,
  }
}

function fetchYears(selectedLeague) {
  if (selectedLeague === undefined)
    throw new Error('selectedLeague is undefined')

  return function(dispatch) {
    dispatch(requestYears(selectedLeague))
    const years = service.getYears(selectedLeague)
    dispatch(receiveYears(selectedLeague, years))
  }
}

/***************** INIT  *********************/

function fetchAll(store) {
  return function(dispatch) {
    let state = store.getState()
    if (!existLeagues(state)) {
      fetchLeagues()(dispatch)
      state = store.getState()
    }

    const selectedLeague = getSelectedLeague(state)
    if (!existYears(state, selectedLeague)) {
      fetchYears(selectedLeague)(dispatch)
      state = store.getState()
    }

    const selectedYear = getSelectedYear(state)
    if (!existTeams(state, selectedLeague, selectedYear)) {
      dispatch(fetchTeams(selectedLeague, selectedYear))
    }

    if (!existMatchDays(state, selectedLeague, selectedYear)) {
      dispatch(fetchMatchDays(selectedLeague, selectedYear)).then(() => {
        let state = store.getState()
        const selectedMatchDay = getSelectedMatchDay(state)
        dispatch(fetchMatchs(selectedLeague, selectedYear, selectedMatchDay))
      })
    }
  }
}

export {
  fetchTeams,
  fetchMatchs,
  fetchMatchDays,
  fetchAll,
  fetchLeagues,
  fetchYears,
  selectMatchDay,
  selectLeague,
  selectYear,
}
