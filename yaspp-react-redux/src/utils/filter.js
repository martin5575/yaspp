import { any } from 'ramda'
import {
  getAllMatchs,
  getAllYearsByLeague,
  getAllMatchDays,
  getAllTeams,
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
  return allMatchs.filter(
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
  return any(getAllMatchs)(state)
}

export const existYears = (state, selectedLeague) => {
  if (!state) throw new Error('state not defined')
  if (!selectedLeague) throw new Error('selectedLeague not defined')
  const yearsOfLeague = getAllYearsByLeague(state)[selectedLeague.toString()]
  return yearsOfLeague && yearsOfLeague.length > 0
}

// export const existTeams = (state, selectedLeague, selectedYear) => {
//   if (!state) throw new Error('state not defined')
//   if (!selectedLeague) throw new Error('selectedLeague not defined')
//   if (!selectedYear) throw new Error('selectedYear not defined')
//   const yearsOfLeague = getAllTeams(state)
//   return yearsOfLeague && yearsOfLeague.length > 0
// }
