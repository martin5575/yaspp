import * as actions from '../actions/actions'

/******************* State ******************/

const initialState = {
  menuId: '',
  selectedLeague: '',
  selectedYear: '',
  selectedMatchDay: 0,

  isInitializing: false,
  isLoadingLeagues: false,
  isLoadingYears: false,
  isLoadingTeams: false,
  isLoadingAllMatchDays: false,
  isLoadingMatchDay: false,
  isRefreshingMatchs: false,

  showPercentage: false,
  selectedModelId: 0,
}

/******************* Reducer ******************/

export const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SelectMatchDay:
      {
        return {
          ...state,
          selectedMatchDay: action.selectedMatchDay,
        }
      }
    case actions.SelectLeague:
      {
        const selectedLeague = action.selectedLeague
        return {
          ...state,
          selectedLeague,
        }
      }
    case actions.SelectYear:
      {
        const selectedYear = action.selectedYear
        return {
          ...state,
          selectedYear,
        }
      }
    case actions.RequestLeagues:
      {
        const isLoadingLeagues = action.isLoadingLeague
        return { ...state,
          isLoadingLeagues
        }
      }
    case actions.RequestYears:
      {
        const isLoadingYears = action.isLoadingYears
        return { ...state,
          isLoadingYears
        }
      }
    case actions.RequestTeams:
      {
        const isLoadingTeams = action.isLoadingTeams
        return { ...state,
          isLoadingTeams
        }
      }
    case actions.RequestMatchDays:
      {
        const isLoadingMatchDays = action.isLoadingMatchDays
        return { ...state,
          isLoadingMatchDays
        }
      }
    case actions.RequestMatchs:
      {
        const isLoadingMatchs = action.isLoadingMatchs
        return { ...state,
          isLoadingMatchs
        }
      }
    case actions.ReceiveLeagues:
      {
        const isLoadingLeagues = action.isLoadingLeagues
        const selectedLeague = action.leagues[0].id
        return {
          ...state,
          isLoadingLeagues,
          selectedLeague,
        }
      }
    case actions.ReceiveYears:
      {
        const isLoadingYears = action.isLoadingYears
        const years = action.yearsByLeague ?
          action.yearsByLeague[action.selectedLeague] :
          undefined
        const selectedYear = years && years.length > 0 ? years[0].id : undefined
        return {
          ...state,
          isLoadingYears,
          selectedYear,
        }
      }
    case actions.ReceiveTeams:
      {
        const isLoadingTeams = action.isLoadingTeams
        return { ...state,
          isLoadingTeams
        }
      }
    case actions.ReceiveMatchDays:
      {
        const isLoadingMatchDays = action.isLoadingMatchDays
        const selectedMatchDay = action.matchDays[0].id
        return {
          ...state,
          isLoadingMatchDays,
          selectedMatchDay,
        }
      }
    case actions.ReceiveMatchs:
      {
        const isLoadingMatchs = action.isLoadingMatchs
        return {
          ...state,
          isLoadingMatchs,
        }
      }
      case actions.ReceiveAllMatchs:
        {
          const isLoadingMatchs = action.isLoadingMatchs
          return {
            ...state,
            isLoadingMatchs,
          }
        }
    case actions.StartInitializing:
      {
        return { ...state,
          isInitializing: action.isInitializing
        }
      }
    case actions.EndInitializing:
      {
        return { ...state,
          isInitializing: action.isInitializing
        }
      }
    case actions.StartRefreshMatchs:
      {
        return { ...state,
          isRefreshingMatchs: action.isRefreshingMatchs
        }
      }
    case actions.EndRefreshMatchs:
      {
        return { ...state,
          isRefreshingMatchs: action.isRefreshingMatchs
        }
      }
    case actions.SwitchMenu:
      {
        return { ...state,
          menuId: action.menuId
        }
      }
    case actions.ShowPercentage:
      {
        return { ...state,
          showPercentage: action.payload
        }
      }
    case actions.SwitchModel:
      {
        return { ...state,
          selectedModelId: action.payload
        }
      }
    case actions.ToggleProbabilityDetails:
      {
        return { ...state,
          probabilityDetailsMatchId: action.payload
        }
      }
    default:
      return state
  }
}