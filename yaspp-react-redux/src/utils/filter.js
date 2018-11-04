import {
  prop,
  map
} from 'ramda'
import {
  getAllMatchs,
  getAllYearsByLeague,
  getAllMatchDays,
  getTeamsByLeagueAndYear,
} from '../reducers/selectors/modelSelector'
import {
  getSelectedLeague,
  getSelectedYear,
  getSelectedMatchDay,
} from '../reducers/selectors/uiSelector'

export function getSelectedMatchs(state) {
  const selectedLeague = getSelectedLeague(state)
  const selectedYear = getSelectedYear(state)
  const selectedMatchDay = getSelectedMatchDay(state)
  const allMatchs = getAllMatchs(state)

  return !allMatchs ? [] : allMatchs.filter(
    (x) =>
    x.league === selectedLeague &&
    x.year === selectedYear &&
    x.matchDayId === selectedMatchDay
  )
}
export function getSelectedYears(state) {
  const selectedLeague = getSelectedLeague(state)
  return getAllYearsByLeague(state)[selectedLeague.toString()]
}

export function getSelectedMatchDays(state) {
  const selectedLeague = getSelectedLeague(state)
  const selectedYear = getSelectedYear(state)

  const allMatchDays = getAllMatchDays(state)

  return allMatchDays.filter(
    (x) => x.league === selectedLeague && x.year === selectedYear
  )
}

export const existsMatchDay = (state, matchDayId) => {
  const matchDays = getSelectedMatchDays(state)
  return !!matchDays.find((x) => x.id === matchDayId)
}

export const existLeagues = (state) => {
  const allLeagues = getAllMatchs(state)
  return allLeagues && allLeagues.length > 0
}

export const existYears = (state, selectedLeague) => {
  if (!state) throw new Error('state not defined')
  if (!selectedLeague) throw new Error('selectedLeague not defined')

  const yearsOfLeague = getAllYearsByLeague(state)[selectedLeague.toString()]
  return yearsOfLeague && yearsOfLeague.length > 0
}

export const existTeams = (state, selectedLeague, selectedYear) => {
  if (!state) throw new Error('state not defined')
  if (!selectedLeague) throw new Error('selectedLeague not defined')
  if (!selectedYear) throw new Error('selectedYear not defined')

  const teamsByLeagueAndYear = getTeamsByLeagueAndYear(state)
  const relevantTeams = teamsByLeagueAndYear.filter(
    (x) => x.league === selectedLeague && x.year === selectedYear
  )
  return relevantTeams && relevantTeams.length > 0
}

export const existMatchDays = (state, selectedLeague, selectedYear) => {
  if (!state) throw new Error('state not defined')
  if (!selectedLeague) throw new Error('selectedLeague not defined')
  if (!selectedYear) throw new Error('selectedYear not defined')

  const matchDays = getAllMatchDays(state)
  const relevantDay = matchDays.filter(
    (x) => x.league === selectedLeague && x.year === selectedYear
  )
  return relevantDay && relevantDay.length > 0
}

export const getLatestUpdate = (matchs) => {
  if (!matchs || matchs.length === 0) return undefined
  const lastUpdates = map(prop('lastUpdate'))(matchs)
    .sort()
    .reverse()
  return lastUpdates[0]
}