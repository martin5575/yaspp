export function getMatchs(state) {
  return state.matchs.filter(
    (x) =>
      x.league === state.selectedLeague &&
      x.year === state.selectedYear &&
      x.matchDayId === state.selectedMatchDay
  )
}
export function getYears(state) {
  return state.yearsByLeague[state.selectedLeague]
}

export function getMatchDays(state) {
  return state.matchDays.filter(
    (x) => x.league === state.selectedLeague && x.year === state.selectedYear
  )
}

export const isPrevMatchDayAvailabe = (state) => {
  const matchDays = getMatchDays(state)
  const minMatchDay = matchDays.length > 0 ? matchDays[0].id : undefined
  return state.selectedMatchDay > minMatchDay
}

export const isNextMatchDayAvailabe = (state) => {
  const matchDays = getMatchDays(state)
  const maxMatchDay =
    matchDays.length > 0 ? matchDays[matchDays.length - 1].id : undefined
  return state.selectedMatchDay < maxMatchDay
}

export const existsMatchDay = (state, matchDayId) => {
  const matchDays = getMatchDays(state)
  return !!matchDays.find((x) => x.id === matchDayId)
}
