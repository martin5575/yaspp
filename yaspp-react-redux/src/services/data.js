/******************* Helper ******************/

const memoize = function(f) {
  let cache = {}
  return function() {
    const arg_str = JSON.stringify(arguments)
    console.log(cache)
    cache[arg_str] = cache[arg_str] || f.apply(f, arguments)
    return cache[arg_str]
  }
}

/******************* Data ******************/

const leagues = [
  {
    id: 'bl1',
    name: '1.Bundesliga',
    key: 3005,
    years: [2018, 2017, 2003],
  },
  {
    id: 'bl2',
    name: '2.Bundesliga',
    years: [2018, 2017, 2016, 2015],
  },
  { id: 'bl3', name: '3.Bundesliga', years: [2018, 2017, 2016, 2015] },
  { id: 'fifa18', name: 'WM18', years: [2018] },
]

function getLeagues() {
  return leagues.map((x) => {
    return { id: x.id, name: x.name }
  })
}

function getYears(leagueId) {
  const league = leagues.find((x) => x.id === leagueId)
  if (!league) return []
  return league.years.map((y) => {
    return { id: y, name: y, leagueId }
  })
}

const openligaBaseUrl = 'https://www.openligadb.de'
function getTeams(league, year) {
  const url = openligaBaseUrl + '/api/getavailableteams/' + league + '/' + year
  //const url = './img/2018'
  return fetch(url).then((x) => x.json())
}
function getMatchDays(league, year) {
  const url = openligaBaseUrl + '/api/getavailablegroups/' + league + '/' + year
  //const url = './img/2017'
  return fetch(url).then((x) => x.json())
}

function getMatchs(league, year, matchday) {
  const url =
    openligaBaseUrl +
    '/api/getmatchdata/' +
    league +
    '/' +
    year +
    '/' +
    matchday
  //const url = './img/8'
  return fetch(url).then((x) => x.json())
}

/****************** Map open liga db data ******************/
function mapMatch(olMatch, league, year) {
  const id = olMatch.MatchID
  const matchDateTime = olMatch.MatchDateTime
  const teamHomeId = olMatch.Team1.TeamId
  const teamAwayId = olMatch.Team2.TeamId
  const isFinished = olMatch.MatchIsFinished
  const matchDayId = olMatch.Group.GroupOrderID
  const leagueKey = olMatch.LeagueId
  const lastUpdate = olMatch.LastUpdateDateTime
  const halfTimeResult = olMatch.MatchResults.find(
    (x) => x.ResultName === 'Halbzeitergebnis'
  )
  const fullTimeResult = olMatch.MatchResults.find(
    (x) => x.ResultName === 'Endergebnis'
  )
  const halfTimeHome = halfTimeResult ? halfTimeResult.PointsTeam1 : '-'
  const halfTimeAway = halfTimeResult ? halfTimeResult.PointsTeam2 : '-'
  const fullTimeHome = fullTimeResult ? fullTimeResult.PointsTeam1 : '-'
  const fullTimeAway = fullTimeResult ? fullTimeResult.PointsTeam2 : '-'
  return {
    id,
    teamHomeId,
    teamAwayId,
    matchDayId,
    league,
    leagueKey,
    year,
    lastUpdate,
    matchDateTime,
    isFinished,
    halfTimeHome,
    halfTimeAway,
    fullTimeHome,
    fullTimeAway,
  }
}

function mapTeam(olTeam) {
  const id = olTeam.TeamId
  const shortName = olTeam.ShortName
  const iconUrl = olTeam.TeamIconUrl
  const name = olTeam.TeamName
  return {
    id,
    shortName,
    iconUrl,
    name,
  }
}

function mapTeamFromMatch(olMatch) {
  //console.log(olMatch)
  const team1 = mapTeam(olMatch.Team1)
  const team2 = mapTeam(olMatch.Team2)
  return [team1, team2]
}

function mapTeamFromMatchs(olMatchs) {
  //console.log(olMatchs.length)
  let teams = {}
  for (let i = 0; i < olMatchs.length; i++) {
    const twoTeams = mapTeamFromMatch(olMatchs[i])
    //console.log(twoTeams)
    const t1 = twoTeams[0]
    teams[t1.id] = t1
    const t2 = twoTeams[1]
    teams[t2.id] = t2
  }
  return teams
}
function mapMatchDay(olGroup, league, year) {
  const id = parseInt(olGroup.GroupOrderID)
  const name = olGroup.GroupName
  const key = parseInt(olGroup.GroupID)
  return { id, name, key, league, year }
}

export {
  getTeams,
  getLeagues,
  getYears,
  getMatchs,
  getMatchDays,
  mapMatch,
  mapMatchDay,
  mapTeam,
  mapTeamFromMatchs,
}
