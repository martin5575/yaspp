import { prop, pipe } from 'ramda'

export const getUi = prop('ui')

export const getSelectedLeague = pipe(
  getUi,
  prop('selectedLeague')
)

export const getSelectedYear = pipe(
  getUi,
  prop('selectedYear')
)

export const getSelectedMatchDay = pipe(
  getUi,
  prop('selectedMatchDay')
)

export const getIsInitializing = pipe(
  getUi,
  prop('isInitializing')
)

export const getIsLoadingLeagues = pipe(
  getUi,
  prop('isLoadingLeagues')
)

export const getIsLoadingYears = pipe(
  getUi,
  prop('isLoadingYears')
)

export const getIsLoadingTeams = pipe(
  getUi,
  prop('isLoadingTeams')
)

export const getIsLoadingAllMatchDays = pipe(
  getUi,
  prop('isLoadingAllMatchDays')
)

export const getIsLoadingMatchDay = pipe(
  getUi,
  prop('isLoadingMatchDay')
)
