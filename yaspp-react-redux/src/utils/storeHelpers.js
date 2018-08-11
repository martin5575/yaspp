export function areSelectedMatchDaysPresent(store) {
  const state = store.getState()
  return state.matchDays.find(
    (x) => x.league === state.selectedLeague && x.year === state.selectedYear
  )
}

export function areSelectedMatchsPresent(store) {
  const state = store.getState()
  return state.matchs.find(
    (x) =>
      x.league === state.selectedLeague &&
      x.year === state.selectedYear &&
      x.matchDayId === state.selectedMatchDay
  )
}
