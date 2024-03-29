import { groupByArray, sortByField } from './listUtils'

const getTeamCount = (state) => {
  return Object.keys(state.model.teams).length
}

const getSeasonsCount = (state) => {
  return groupByArray(state.model.matchs, (x) => x.league).map((x) => ({
    league: x.key,
    name: state.model.leagues.find((y) => y.id === x.key).name,
    seasons: sortByField(
      groupByArray(x.values, (y) => y.year).map((z) => ({
        year: z.key,
        count: groupByArray(z.values, (z1) => z1.matchDayId).length,
      })),
      'year'
    ),
  }))
}

export const getStorageStats = (state) => ({
  teamCount: getTeamCount(state),
  leagues: getSeasonsCount(state),
})
