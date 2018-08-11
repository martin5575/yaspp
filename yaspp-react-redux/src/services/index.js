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

export { getTeams, getLeagues, getYears, getMatchs, getMatchDays }
