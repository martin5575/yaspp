import leagues from './leagues'

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
// new urls: https://api.openligadb.de/getmatchdata/bl1/2020/1
const openligaBaseUrl = 'https://api.openligadb.de'
function getTeams(league, year) {
  if (!league) throw new Error('league is not defined')
  if (!year) throw new Error('year is not defined')
  const url = `${openligaBaseUrl}/getavailableteams/${league}/${year}`
  return fetch(url).then((x) => x.json())
}
function getMatchDays(league, year) {
  if (!league) throw new Error('league is not defined')
  if (!year) throw new Error('year is not defined')
  const url = `${openligaBaseUrl}/getavailablegroups/${league}/${year}`
  return fetch(url).then((x) => x.json())
}

function getMatchs(league, year, matchday) {
  if (!league) throw new Error('league is not defined')
  if (!year) throw new Error('year is not defined')
  if (!matchday) throw new Error('matchday is not defined')
  const url = `${openligaBaseUrl}/getmatchdata/${league}/${year}/${matchday}`
  return fetch(url).then((x) => x.json())
}

function getMatchsLastChangeDate(league, year, matchday) {
  if (!league) throw new Error('league is not defined')
  if (!year) throw new Error('year is not defined')
  if (!matchday) throw new Error('matchday is not defined')
  const url = `${openligaBaseUrl}/getlastchangedate/${league}/${year}/${matchday}`
  return fetch(url).then((x) => x.json())
}

function getCurrentMatchDay(league) {
  if (!league) throw new Error('league is not defined')
  const url = `${openligaBaseUrl}/getcurrentgroup/${league}`
  return fetch(url).then((x) => x.json())
}

export {
  getTeams,
  getLeagues,
  getYears,
  getMatchs,
  getMatchDays,
  getMatchsLastChangeDate,
  getCurrentMatchDay,
}
