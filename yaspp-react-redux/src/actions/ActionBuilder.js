import * as actions from './actions'

import * as service from '../services'
import * as mapper from '../services/mapOpenLigaDB'

const dictionarize = function(array) {
  let result = {}
  for (let i = 0; i < array.length; i++) {
    const x = array[i]
    result[x.id] = x
  }
  return result
}
/******************* ActionBuilder ******************/

function selectMatchDay(selectedMatchDay) {
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
  /*.reduce({},
    (x, y) => { x[y.id] = y console.log(x) return x }) */

  console.log(teams)
  return {
    type: actions.ReceiveTeams,
    isLoadingTeams: false,
    selectedLeague,
    selectedYear,
    teams,
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
function requestLeagues() {
  return { type: actions.RequestLeagues, isLoadingLeagues: true }
}
function receiveLeagues(json) {
  //console.log(json)
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
  return function(dispatch) {
    dispatch(requestYears(selectedLeague))
    const years = service.getYears(selectedLeague)
    console.log(years)
    dispatch(receiveYears(selectedLeague, years))
  }
}
function fetchAll(store) {
  return function(dispatch) {
    dispatch(requestLeagues())
    const leagues = service.getLeagues()
    dispatch(receiveLeagues(leagues))
    let state = store.getState()
    const selectedLeague = state.selectedLeague
    dispatch(requestYears(selectedLeague))
    const years = service.getYears(selectedLeague)
    dispatch(receiveYears(selectedLeague, years))
    state = store.getState()
    const selectedYear = state.selectedYear
    dispatch(fetchTeams(selectedLeague, selectedYear))
    dispatch(fetchMatchDays(selectedLeague, selectedYear)).then(() => {
      let state = store.getState()
      const selectedMatchDay = state.selectedMatchDay
      dispatch(fetchMatchs(selectedLeague, selectedYear, selectedMatchDay))
    })
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
