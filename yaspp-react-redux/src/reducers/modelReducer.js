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
  switch (action.type) {
    case actions.ReceiveLeagues: {
      const leagues = [...action.leagues]
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
      const teams = { ...state.teams, ...action.teams }

      const matchDict = state.matchs.reduce((res,x) => {
        res[x.id]=x
        return res
      }, {})
      
      for (let i=0;i<action.matchs.length;++i) {
        const match = action.matchs[i]
        matchDict[match.id]=match
      }
      const matchs = Object.values(matchDict)

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
      const { league, year } = action.payload
      return {
        ...state,
        matchDays: state.matchDays.filter(
          (x) => !(x.league === league && x.year === year)
        ),
        matchs: state.matchs.filter(
          (x) => !(x.league === league && x.year === year)
        ),
        teamsByLeagueAndYear: state.teamsByLeagueAndYear.filter(
          (x) => !(x.league === league && x.year === year)
        ),
      }
    }

    default:
      return state
  }
}
