import { prop, pipe } from 'ramda'

export const getModel = prop('model')

export const getAllLeagues = pipe(
  getModel,
  prop('leagues')
)

export const getAllTeams = pipe(
  getModel,
  prop('teams')
)

export const getTeamsByLeagueAndYear = pipe(
  getModel,
  prop('teamsByLeagueAndYear')
)

export const getAllMatchDays = pipe(
  getModel,
  prop('matchDays')
)

export const getAllMatchs = pipe(
  getModel,
  prop('matchs')
)

export const getAllYearsByLeague = pipe(
  getModel,
  prop('yearsByLeague')
)

export const getCurrentMatchDay = pipe(
  getModel,
  prop('currentMatchDay')
) 
