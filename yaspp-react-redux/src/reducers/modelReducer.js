import * as actions from '../actions/actions'

/******************* State ******************/

export const initialState = {
  leagues: [],
  yearsByLeague: {},
  teams: {},
  matchDays: [],
  matchs: [],
  teamsByLeagueAndYear: [],
}

/******************* Reducer ******************/

export const modelReducer = (state = initialState, action) => {
  console.log(action ? action.type : '')
  console.log(action)
  console.log(state)
  switch (action.type) {
    case actions.ReceiveLeagues: {
      const leagues = [...state.leagues, ...action.leagues]
      return {
        ...state,
        leagues,
      }
    }
    case actions.ReceiveYears: {
      const yearsByLeague = { ...state.yearsByLeague, ...action.yearsByLeague }
      return {
        ...state,
        yearsByLeague,
      }
    }
    case actions.ReceiveTeams: {
      const teams = {
        ...state.teams,
        ...action.teams,
      }
      const teamsByLeagueAndYear = [
        ...state.teamsByLeagueAndYear,
        ...action.teamsByLeagueAndYear,
      ]
      return { ...state, teams, teamsByLeagueAndYear }
    }
    case actions.ReceiveMatchDays: {
      const matchDays = [...state.matchDays, ...action.matchDays]

      return {
        ...state,
        matchDays,
      }
    }
    case actions.ReceiveMatchs: {
      const matchs = [...state.matchs, ...action.matchs]
      const teams = { ...state.teams, ...action.teams }

      return {
        ...state,
        matchs,
        teams,
      }
    }
    case actions.clearAll: {
      return initialState
    }
    case actions.clearSeason: {
      return { ...state, teams: [] }
    }

    default:
      return state
  }
}
