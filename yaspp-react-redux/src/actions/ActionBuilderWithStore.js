import {
  fetchTeams,
  fetchMatchs,
  fetchMatchDays,
  fetchInitial,
  fetchLeagues,
  fetchYears,
  selectMatchDay,
  selectLeague,
  selectYear,
} from './ActionBuilder'
import {
  areSelectedMatchDaysPresent,
  areSelectedMatchsPresent,
} from '../utils/storeHelpers'
import {
  getSelectedLeague,
  getSelectedYear,
  getSelectedMatchDay,
} from '../reducers/selectors/uiSelector'

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

const dispatchFetchInitial = function(store) {
  return store.dispatch(fetchInitial(store))
}

const dispatchFetchLeagues = function(store) {
  return store.dispatch(fetchLeagues())
}

const dispatchFetchYears = function(store, league) {
  return store.dispatch(fetchYears(league))
}

const dispatchSelectMatchDay = function(store, matchDay) {
  return store.dispatch(selectMatchDay(store.getState(), matchDay))
}

const dispatchSelectLeague = function(store, league) {
  return store.dispatch(selectLeague(league))
}

const dispatchSelectYear = function(store, league, year) {
  return store.dispatch(selectYear(league, year))
}

const updateMatchDaysIfNecessary = (store) => {
  let state = store.getState()
  if (!areSelectedMatchDaysPresent(store)) {
    state = store.getState()
    dispatchFetchMatchDays(
      store,
      getSelectedLeague(state),
      getSelectedYear(state)
    )
  }
  state = store.getState()
  let selectedMatchDay = getSelectedMatchDay(state)
  selectedMatchDay = selectedMatchDay ? selectedMatchDay : 1
  dispatchSelectMatchDay(store, selectedMatchDay)

  if (!areSelectedMatchsPresent(store)) {
    const state = store.getState()
    dispatchFetchMatchs(
      store,
      getSelectedLeague(state),
      getSelectedYear(state),
      getSelectedMatchDay(state)
    )
  }
}

export {
  dispatchFetchInitial,
  dispatchFetchLeagues,
  dispatchFetchTeams,
  dispatchFetchMatchDays,
  dispatchFetchMatchs,
  dispatchFetchYears,
  dispatchSelectMatchDay,
  dispatchSelectLeague,
  dispatchSelectYear,
  updateMatchDaysIfNecessary,
}
