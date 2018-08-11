import {
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
} from './ActionBuilder'

/******************* ActionBuilder with store ******************/
const dispatchFetchTeams = function(store, league, year) {
  return store.dispatch(fetchTeams(league, year))
}

const dispatchFetchMatchs = function(store, league, year, matchDay) {
  return store.dispatch(fetchMatchs(league, year, matchDay))
}

const dispatchFetchMatchDays = function(store, league, year) {
  return store.dispatch(fetchMatchDays(league, year))
}

const dispatchFetchAll = function(store) {
  return store.dispatch(fetchAll(store))
}

const dispatchFetchLeagues = function(store) {
  return store.dispatch(fetchLeagues())
}

const dispatchFetchYears = function(store, league) {
  return store.dispatch(fetchYears(league))
}

const dispatchNextMatchDay = function(store) {
  return store.dispatch(nextMatchDay())
}

const dispatchPrevMatchDay = function(store) {
  return store.dispatch(prevMatchDay())
}

const dispatchSelectMatchDay = function(store, matchDay) {
  return store.dispatch(selectMatchDay(matchDay))
}

const dispatchSelectLeague = function(store, league) {
  return store.dispatch(selectLeague(league))
}

const dispatchSelectYear = function(store, league, year) {
  return store.dispatch(selectYear(league, year))
}

export {
  dispatchFetchAll,
  dispatchFetchLeagues,
  dispatchFetchTeams,
  dispatchFetchMatchDays,
  dispatchFetchMatchs,
  dispatchFetchYears,
  dispatchNextMatchDay,
  dispatchPrevMatchDay,
  dispatchSelectMatchDay,
  dispatchSelectLeague,
  dispatchSelectYear,
}
