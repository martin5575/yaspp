import { groupByArray, sortByField } from './listUtils'

const SERIALIZED_STATE_KEY = 'yaspp_state'

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem(SERIALIZED_STATE_KEY)
    if (serializedState === null) {
      return undefined
    }
    return JSON.parse(serializedState)
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem(SERIALIZED_STATE_KEY, serializedState)
  } catch (error) {
    console.error(error)
  }
}

const getTeamCount = (state) => {
  return Object.keys(state.model.teams).length
}

const getSeasonsCount = (state) => {
  return groupByArray(state.model.matchDays, (x) => x.league).map((x) => ({
    league: x.key,
    name: state.model.leagues.find((y) => y.id === x.key).name,
    seasons: sortByField(
      groupByArray(x.values, (y) => y.year).map((z) => ({
        year: z.key,
        count: z.values.length,
      })),
      'year'
    ),
  }))
}

export const getStorageStats = (state) => ({
  teamCount: getTeamCount(state),
  leagues: getSeasonsCount(state),
})
