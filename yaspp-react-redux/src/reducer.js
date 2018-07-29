import * as actions from './actions'
import { existsMatchDay } from './filter'

/******************* State ******************/

const initialState = {
  isInitializing: true,
  selectedLeague: '',
  isLoadingLeagues: false,
  selectedYear: '',
  isLoadingYears: false,
  isLoadingTeams: false,
  selectedMatchDay: 0,
  isLoadingAllMatchDays: false,
  isLoadingMatchDay: false,
  leagues: [],
  yearsByLeague: {},
  teams: {},
  matchDays: [],
  matchs: [],
}

/******************* Reducer ******************/

function reducer(state = initialState, action) {
  console.log(action ? action.type : '')
  switch (action.type) {
    case actions.NextMatchDay: {
      let selectedMatchDay = state.selectedMatchDay + 1
      if (!existsMatchDay(state, selectedMatchDay))
        selectedMatchDay = state.selectedMatchDay
      return Object.assign({}, state, {
        selectedMatchDay,
      })
    }
    case actions.PrevMatchDay: {
      let selectedMatchDay = state.selectedMatchDay - 1
      if (!existsMatchDay(state, selectedMatchDay))
        selectedMatchDay = state.selectedMatchDay
      return Object.assign({}, state, {
        selectedMatchDay,
      })
    }
    case actions.SelectMatchDay: {
      let selectedMatchDay = action.selectedMatchDay
      if (!existsMatchDay(state, selectedMatchDay))
        selectedMatchDay = state.selectedMatchDay
      return Object.assign({}, state, {
        selectedMatchDay,
      })
    }
    case actions.SelectLeague: {
      const selectedLeague = action.selectedLeague
      return Object.assign({}, state, {
        selectedLeague,
      })
    }
    case actions.SelectYear: {
      const selectedYear = action.selectedYear
      return Object.assign({}, state, {
        selectedYear,
      })
    }
    case actions.RequestLeagues: {
      const isLoadingLeagues = action.isLoadingLeague
      const isInitializing = false
      return Object.assign({}, state, { isLoadingLeagues, isInitializing })
    }
    case actions.RequestYears: {
      const isLoadingYears = action.isLoadingYears
      return Object.assign({}, state, { isLoadingYears })
    }
    case actions.RequestTeams: {
      const isLoadingTeams = action.isLoadingTeams
      return Object.assign({}, state, { isLoadingTeams })
    }
    case actions.RequestMatchDays: {
      const isLoadingMatchDays = action.isLoadingMatchDays
      return Object.assign({}, state, { isLoadingMatchDays })
    }
    case actions.RequestMatchs: {
      const isLoadingMatchs = action.isLoadingMatchs
      return Object.assign({}, state, { isLoadingMatchs })
    }
    case actions.ReceiveLeagues: {
      const isLoadingLeagues = action.isLoadingLeagues
      const leagues = [...state.leagues, ...action.leagues]
      const selectedLeague = leagues[0].id
      return Object.assign({}, state, {
        isLoadingLeagues,
        leagues,
        selectedLeague,
      })
    }
    case actions.ReceiveYears: {
      const isLoadingYears = action.isLoadingYears
      const yearsByLeague = { ...state.yearsByLeague, ...action.yearsByLeague }
      const years = action.yearsByLeague[action.selectedLeague]
      let selectedYear = state.selectedYear
      if (!selectedYear || !years.find((x) => x.id === selectedYear))
        selectedYear = years[0].id
      return Object.assign({}, state, {
        isLoadingYears,
        yearsByLeague,
        selectedYear,
      })
    }
    case actions.ReceiveTeams: {
      const isLoadingTeams = action.isLoadingTeams
      const teams = {
        ...state.teams,
        ...action.teams,
      }
      const newState = Object.assign({}, state, { isLoadingTeams, teams })
      //console.log(newState)
      return newState
    }
    case actions.ReceiveMatchDays: {
      //console.log(action.matchDays)
      const isLoadingMatchDays = action.isLoadingMatchDays
      const matchDays = [...state.matchDays, ...action.matchDays] //console.log(matchDays)

      const selectedMatchDay = matchDays[0].id //console.log(selectedMatchDay)
      const newState = Object.assign({}, state, {
        isLoadingMatchDays,
        matchDays,
        selectedMatchDay,
      }) //console.log(newState)
      return newState
    }
    case actions.ReceiveMatchs: {
      //console.log(action.matchs)
      const isLoadingMatchs = action.isLoadingMatchs

      const matchs = [...state.matchs, ...action.matchs]
      const teams = { ...state.teams, ...action.teams }

      const newState = Object.assign({}, state, {
        isLoadingMatchs,
        matchs,
        teams,
      })
      console.log(newState)
      return newState
    }
    default:
      return state
  }
}

export { reducer }
