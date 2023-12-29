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
  sortByField,
  sum
} from '../utils/listUtils'

import * as stats from './statsType';
import { sortBy } from 'lodash';

const getPoints = (gf, ga) => {
  if (gf > ga) return 3
  if (gf === ga) return 1
  return 0
}

const getHomePoints = (match) =>
  getPoints(match.fullTimeHome, match.fullTimeAway)
const getAwayPoints = (match) =>
  getPoints(match.fullTimeAway, match.fullTimeHome)


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
  
  const tm = (teamInfo) => {
    return sumFields(teamInfo, 'hm', 'am')
  }


export const getSeasonInfo = (state) => {
  const league = getSelectedLeague(state)
  const year = getSelectedYear(state)
  const matchDay = getSelectedMatchDay(state)
  const allMatchs = getAllMatchs(state)

  const previousMatchs = !allMatchs ? [] :
    // @ts-ignore
    allMatchs.filter(
      (m) => m.year === year && m.league === league && m.isFinished &&
      m.matchDayId < matchDay
    )
    
  const aggSeasonInfo = aggregateSeasonInfo(previousMatchs)
  return sortByField(aggSeasonInfo, ["tp", "tgf", "tga"]).reverse()
}

export const aggregateSeasonInfo = (matchs) => {
  const home = groupByArray(matchs, 'teamHomeId').map((x) => {
    const hgf =sum(x.values.map((y) => y.fullTimeHome));
    const hga = sum(x.values.map((y) => y.fullTimeAway));
    return ({
    team: x.key,
    hgf: hgf,
    hga: hga,
    hgd: hgf - hga,
    hp: sum(x.values.map((y) => getHomePoints(y))),
    hm: x.values.length,
  })})
  const away = groupByArray(matchs, 'teamAwayId').map((x) => { 
    const agf = sum(x.values.map((y) => y.fullTimeAway));
    const aga = sum(x.values.map((y) => y.fullTimeHome));
    return ({
    team: x.key,
    agf: agf,
    aga: aga,
    agd: agf - aga,
    ap: sum(x.values.map((y) => getAwayPoints(y))),
    am: x.values.length,
  })})
  
  const fullByTeam = groupByArray([...home, ...away], 'team')
  const full = fullByTeam.map((x) =>
    x.values.reduce((res, x) => ({ ...res,
      ...x
    }), {hgf:0, hga:0, hp:0, hm:0, agf:0, aga:0, ap:0, am:0})
  )

  const fullWithTotal = full.map(x=>{
    var res = {...x}
    res.tgf = tgf(x)
    res.tga = tga(x)
    res.tp = tp(x)
    res.tm = tm(x)
    res.tgd = res.tgf - res.tga
    return res    
  })

  const totalGA = fullWithTotal.reduce((res,x)=>{
    var aggregate = { ...res };
    aggregate.hga += x.hga;
    aggregate.hm += x.hm;
    aggregate.aga += x.aga;
    aggregate.am += x.am;
    aggregate.tga += x.tga;
    aggregate.tm += x.tm;
    return aggregate;
  }, {hga:0, hm:0, aga:0, am:0, tga:0, tm:0, gd:0})

  const avgGA = {
    hga: totalGA.hm > 0 ? totalGA.hga / totalGA.hm : undefined,
    aga: totalGA.am > 0 ? totalGA.aga / totalGA.am : undefined,
    tga: totalGA.tm > 0 ? totalGA.tga / totalGA.tm : undefined
  }

  const fullWithDefenseFactor = fullWithTotal.map(x => ({...x, 
    hdf: avgGA.hga ? (x.hga/x.hm) / avgGA.hga : 1.0,
    adf: avgGA.aga ? (x.aga/x.am) / avgGA.aga : 1.0,
    tdf: avgGA.tga ? (x.tga/x.tm) / avgGA.tga : 1.0
    })
  )

  return fullWithDefenseFactor
}



const getHG_AG_AVG = (infoHome, infoAway) => {
  const goalsHome =
    infoHome && infoHome.hm ? infoHome.hgf / infoHome.hm : undefined
  const goalsAway =
    infoAway && infoAway.am ? infoAway.agf / infoAway.am : undefined
  return {
    home: goalsHome,
    away: goalsAway
  }
}

const getHGDF_AGDF_AVG = (infoHome, infoAway) => {
  const goals = getHG_AG_AVG(infoHome, infoAway)
  return {
    home: goals.home && infoAway.adf ? goals.home * infoAway.adf :undefined,
    away: goals.away && infoHome.hdf ? goals.away * infoHome.hdf: undefined
  }
}

const getTG_TG_AVG = (infoHome, infoAway) => {
  const goalsHome =
    infoHome && infoHome.tm ? infoHome.tgf / infoHome.tm : undefined
  const goalsAway =
    infoAway && infoAway.tm ? infoAway.tgf / infoAway.tm : undefined
  return {
    home: goalsHome,
    away: goalsAway
  }
}

const getTGDF_TGDF_AVG = (infoHome, infoAway) => {
  const goals = getTG_TG_AVG(infoHome, infoAway)
  return {
    home: goals.home && infoAway.tdf ? goals.home * infoAway.tdf :undefined,
    away: goals.away && infoHome.tdf ? goals.away * infoHome.tdf :undefined,
  }
}

const getStats = (infoHome, infoAway, statsType) => {
  switch (statsType) {
    case stats.HomeGoalsVsAwayGoalsWithDefenseFactor:
      return getHGDF_AGDF_AVG(infoHome, infoAway)
    case stats.HomeGoalsVsAwayGoals:
      return getHG_AG_AVG(infoHome, infoAway)
    case stats.TotalGoalsVsTotalGoalsWithDefenseFactor:
      return getTGDF_TGDF_AVG(infoHome, infoAway)
    case stats.TotalGoalsVsTotalGoals:
      return getTG_TG_AVG(infoHome, infoAway)
    case stats.TwoToOne:
      return {
        home: 2,
        away: 1
      }
    case stats.OneToOne:
      return {
        home: 1,
        away: 1
      }
    default:
      return undefined
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