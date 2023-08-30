/****************** Map open liga db data ******************/
function mapMatch(olMatch, league, year) {
  const id = olMatch.matchID
  const matchDateTime = olMatch.matchDateTime
  const teamHomeId = olMatch.team1.teamId
  const teamAwayId = olMatch.team2.teamId
  const isFinished = olMatch.matchIsFinished
  const matchDayId = olMatch.group.groupOrderID
  const leagueKey = olMatch.leagueId
  const lastUpdate = olMatch.lastUpdateDateTime
  const halfTimeResult = olMatch.matchResults.find(
    (x) => x.resultName === "Halbzeit" || x.resultName === "Halbzeitergebnis"
  )
  const fullTimeResult = olMatch.matchResults.find(
    (x) => x.resultName === "Endergebnis"
  )
  const halfTimeHome = halfTimeResult ? halfTimeResult.pointsTeam1 : '-'
  const halfTimeAway = halfTimeResult ? halfTimeResult.pointsTeam2 : '-'
  const fullTimeHome = fullTimeResult ? fullTimeResult.pointsTeam1 : '-'
  const fullTimeAway = fullTimeResult ? fullTimeResult.pointsTeam2 : '-'
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
  const id = olTeam.teamId
  const shortName = olTeam.shortName
  const iconUrl = olTeam.teamIconUrl
  const name = olTeam.teamName
  return {
    id,
    shortName,
    iconUrl,
    name,
  }
}

function mapTeamFromMatch(olMatch) {
  const team1 = mapTeam(olMatch.team1)
  const team2 = mapTeam(olMatch.team2)
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
  const id = parseInt(olGroup.groupOrderID, 10)
  const name = olGroup.groupName
  const key = parseInt(olGroup.groupID, 10)
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