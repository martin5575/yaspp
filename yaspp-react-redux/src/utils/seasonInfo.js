import {
  getSelectedLeague,
  getSelectedYear,
  getSelectedMatchDay,
} from '../reducers/selectors/uiSelector'
import {
  getAllMatchs
} from '../reducers/selectors/modelSelector'
import {
  groupByArray,
  sum
} from './listUtils'

const getPoints = (gf, ga) => {
  if (gf > ga) return 3
  if (gf === ga) return 1
  return 0
}

const getHomePoints = (match) =>
  getPoints(match.fullTimeHome, match.fullTimeAway)
const getAwayPoints = (match) =>
  getPoints(match.fullTimeAway, match.fullTimeHome)

export const getSeasonInfo = (state) => {
  const league = getSelectedLeague(state)
  const year = getSelectedYear(state)
  const matchDay = getSelectedMatchDay(state)
  const allMatchs = getAllMatchs(state)
  const previousMatchs = !allMatchs ? [] :
    // @ts-ignore
    allMatchs.filter(
      (m) => m.year === year && m.league === league && m.matchDayId < matchDay
    )
  const home = groupByArray(previousMatchs, 'teamHomeId').map((x) => ({
    team: x.key,
    hgf: sum(x.values.map((y) => y.fullTimeHome)),
    hga: sum(x.values.map((y) => y.fullTimeAway)),
    hp: sum(x.values.map((y) => getHomePoints(y))),
    hg: x.values.length,
  }))
  const away = groupByArray(previousMatchs, 'teamAwayId').map((x) => ({
    team: x.key,
    agf: sum(x.values.map((y) => y.fullTimeAway)),
    aga: sum(x.values.map((y) => y.fullTimeHome)),
    ap: sum(x.values.map((y) => getAwayPoints(y))),
    ag: x.values.length,
  }))
  const fullByTeam = groupByArray([...home, ...away], 'team')
  const full = fullByTeam.map((x) =>
    x.values.reduce((res, x) => ({ ...res,
      ...x
    }), {})
  )

  return full
}

const sumFields = (teamInfo, key1, key2) => {
  return !teamInfo ?
    undefined :
    teamInfo[key1] && teamInfo[key2] ?
    teamInfo[key1] + teamInfo[key2] :
    teamInfo[key1] ?
    teamInfo[key1] :
    teamInfo[key2]
}

const tgf = (teamInfo) => {
  return sumFields(teamInfo, 'hgf', 'agf')
}

const tga = (teamInfo) => {
  return sumFields(teamInfo, 'hga', 'aga')
}

const tp = (teamInfo) => {
  return sumFields(teamInfo, 'hp', 'ap')
}

const tg = (teamInfo) => {
  return sumFields(teamInfo, 'hg', 'ag')
}

const getHGF_AGF_AVG = (infoHome, infoAway) => {
  const goalsHome =
    infoHome && infoHome.hg ? infoHome.hgf / infoHome.hg : undefined
  const goalsAway =
    infoAway && infoAway.ag ? infoAway.agf / infoAway.ag : undefined
  return {
    home: goalsHome,
    away: goalsAway
  }
}

const getTPF_TPF_TOTAL = (infoHome, infoAway) => {
  const pointsHome = tp(infoHome)
  const pointsAway = tp(infoAway)
  return {
    home: pointsHome,
    away: pointsAway
  }
}

const getStats = (infoHome, infoAway, stats) => {
  switch (stats) {
    case 'hgf_agf_avg':
      return getHGF_AGF_AVG(infoHome, infoAway)
    case 'tpf_tpf_total':
    default:
      return getTPF_TPF_TOTAL(infoHome, infoAway)
  }
}

export const calcStats = (seasonInfo, teamHomeId, teamAwayId, stats) => {
  const infoHome = seasonInfo.find((x) => x.team === teamHomeId)
  const infoAway = seasonInfo.find((x) => x.team === teamAwayId)
  return getStats(infoHome, infoAway, stats)
}

const formatNumber = (n, digits) => (n ? n.toFixed(digits) : '0.0')
export const formatStats = (stats, digits = 2) => {
  return `${formatNumber(stats.home, digits)}:${formatNumber(
    stats.away,
    digits
  )}`
}