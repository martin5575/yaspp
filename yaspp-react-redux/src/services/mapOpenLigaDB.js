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
    (x) => x.ResultOrderID === 2
  )
  const fullTimeResult = olMatch.MatchResults.find(
    (x) => x.ResultOrderID === 1
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
  const team1 = mapTeam(olMatch.Team1)
  const team2 = mapTeam(olMatch.Team2)
  return [team1, team2]
}

function mapTeamFromMatchs(olMatchs) {
  let teams = {}
  for (let i = 0; i < olMatchs.length; i++) {
    const twoTeams = mapTeamFromMatch(olMatchs[i])
    const t1 = twoTeams[0]
    teams[t1.id] = t1
    const t2 = twoTeams[1]
    teams[t2.id] = t2
  }
  return teams
}

function mapMatchDay(olGroup, league, year) {
  const id = parseInt(olGroup.GroupOrderID, 10)
  const name = olGroup.GroupName
  const key = parseInt(olGroup.GroupID, 10)
  return {
    id,
    name,
    key,
    league,
    year
  }
}

export {
  mapMatch,
  mapMatchDay,
  mapTeam,
  mapTeamFromMatchs
}