import {
  getSelectedLeague,
  getSelectedYear,
  getSelectedMatchDay,
} from '../reducers/selectors/uiSelector'
import {
  getAllMatchDays,
  getAllMatchs,
} from '../reducers/selectors/modelSelector'

export function areSelectedMatchDaysPresent(store) {
  const state = store.getState()
  const selectedLeague = getSelectedLeague(state)
  const selectedYear = getSelectedYear(state)
  const allMatchDays = getAllMatchDays(state)
  return allMatchDays.find(
    (x) => x.league === selectedLeague && x.year === selectedYear
  )
}

export function areSelectedMatchsPresent(store) {
  const state = store.getState()
  const selectedLeague = getSelectedLeague(state)
  const selectedYear = getSelectedYear(state)
  const selectedMatchDay = getSelectedMatchDay(state)
  const allMatchs = getAllMatchs(state)
  return allMatchs.find(
    (x) =>
      x.league === selectedLeague &&
      x.year === selectedYear &&
      x.matchDayId === selectedMatchDay
  )
}
