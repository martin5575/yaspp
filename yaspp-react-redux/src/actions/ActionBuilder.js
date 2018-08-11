import {
  RequestLeagues,
  RequestYears,
  RequestTeams,
  RequestMatchDays,
  RequestMatchs,
  ReceiveLeagues,
  ReceiveYears,
  ReceiveTeams,
  ReceiveMatchDays,
  ReceiveMatchs,
  NextMatchDay,
  PrevMatchDay,
  SelectMatchDay,
  SelectLeague,
  SelectYear,
} from './actions'

import {
  getTeams,
  getLeagues,
  getYears,
  getMatchs,
  getMatchDays,
  mapMatch,
  mapMatchDay,
  mapTeam,
  mapTeamFromMatchs,
} from '../services/data'

const dictionarize = function(array) {
  let result = {}
  for (let i = 0; i < array.length; i++) {
    const x = array[i]
    result[x.id] = x
  }
  return result
}
/******************* ActionBuilder ******************/

function nextMatchDay() {
  return { type: NextMatchDay }
}

function prevMatchDay() {
  return { type: PrevMatchDay }
}

function selectMatchDay(selectedMatchDay) {
  return {
    type: SelectMatchDay,
    selectedMatchDay,
  }
}

function selectLeague(selectedLeague) {
  return {
    type: SelectLeague,
    selectedLeague,
  }
}

function selectYear(selectedLeague, selectedYear) {
  return {
    type: SelectYear,
    selectedLeague,
    selectedYear,
  }
}

function requestMatchDays(selectedLeague, selectedYear) {
  return {
    type: RequestMatchDays,
    isLoadingMatchDays: true,
    selectedLeague,
    selectedYear,
  }
}

function receiveMatchDays(selectedLeague, selectedYear, json) {
  return {
    type: ReceiveMatchDays,
    isLoadingMatchDays: false,
    selectedLeague,
    selectedYear,
    matchDays: json.map((x) => mapMatchDay(x, selectedLeague, selectedYear)),
  }
}

function fetchMatchDays(selectedLeague, selectedYear) {
  return function(dispatch) {
    dispatch(requestMatchDays(selectedLeague, selectedYear))
    return getMatchDays(selectedLeague, selectedYear).then((json) =>
      dispatch(receiveMatchDays(selectedLeague, selectedYear, json))
    )
  }
}

function requestMatchs(selectedLeague, selectedYear, selectedMatchDay) {
  return {
    type: RequestMatchs,
    isLoadingMatchs: true,
    selectedLeague,
    selectedYear,
    selectedMatchDay,
  }
}

function receiveMatchs(selectedLeague, selectedYear, selectedMatchDay, json) {
  const teams = mapTeamFromMatchs(json)
  return {
    type: ReceiveMatchs,
    isLoadingMatchs: false,
    selectedLeague,
    selectedYear,
    selectedMatchDay,
    matchs: json.map((x) => mapMatch(x, selectedLeague, selectedYear)),
    teams,
  }
}
function fetchMatchs(selectedLeague, selectedYear, selectedMatchDay) {
  return function(dispatch) {
    dispatch(requestMatchs(selectedLeague, selectedYear, selectedMatchDay))
    return getMatchs(selectedLeague, selectedYear, selectedMatchDay).then(
      (json) =>
        dispatch(
          receiveMatchs(selectedLeague, selectedYear, selectedMatchDay, json)
        )
    )
  }
}

function requestTeams(selectedLeague, selectedYear) {
  return {
    type: RequestTeams,
    isLoadingTeams: true,
    selectedLeague,
    selectedYear,
  }
}

function receiveTeams(selectedLeague, selectedYear, json) {
  const teamData = json.map((x) => mapTeam(x))
  const teams = dictionarize(teamData)
  /*.reduce({},
    (x, y) => { x[y.id] = y console.log(x) return x }) */

  console.log(teams)
  return {
    type: ReceiveTeams,
    isLoadingTeams: false,
    selectedLeague,
    selectedYear,
    teams,
  }
}

function fetchTeams(selectedLeague, selectedYear) {
  return function(dispatch) {
    dispatch(requestTeams(selectedLeague, selectedYear))
    const promise = getTeams(selectedLeague, selectedYear)
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
  return { type: RequestLeagues, isLoadingLeagues: true }
}
function receiveLeagues(json) {
  //console.log(json)
  return {
    type: ReceiveLeagues,
    isLoadingLeagues: false,
    leagues: json.map((x) => x),
  }
}
function fetchLeagues() {
  return function(dispatch) {
    dispatch(requestLeagues())
    const leagues = getLeagues()
    dispatch(receiveLeagues(leagues))
  }
}
function requestYears(selectedLeague) {
  return {
    type: RequestYears,
    isLoadingYears: true,
    selectedLeague,
  }
}
function receiveYears(selectedLeague, json) {
  const years = json.map((x) => x)
  let yearsByLeague = {}
  yearsByLeague[selectedLeague] = years
  return {
    type: ReceiveYears,
    selectedLeague: selectedLeague,
    isLoadingYears: false,
    yearsByLeague,
  }
}

function fetchYears(selectedLeague) {
  return function(dispatch) {
    dispatch(requestYears(selectedLeague))
    const years = getYears(selectedLeague)
    console.log(years)
    dispatch(receiveYears(selectedLeague, years))
  }
}
function fetchAll(store) {
  return function(dispatch) {
    dispatch(requestLeagues())
    const leagues = getLeagues()
    dispatch(receiveLeagues(leagues))
    let state = store.getState()
    const selectedLeague = state.selectedLeague
    dispatch(requestYears(selectedLeague))
    const years = getYears(selectedLeague)
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
  nextMatchDay,
  prevMatchDay,
  selectMatchDay,
  selectLeague,
  selectYear,
}
