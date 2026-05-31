#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const dataFile = path.join(__dirname, 'wc26-matches.json')
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'))

const teamStats = {}

// Process each match
data.matches.forEach((match) => {
  const team = match.team
  const opponent = match.opponent
  const goalsFor = match.goalsFor
  const goalsAgainst = match.goalsAgainst

  // Initialize team stats if not exists
  if (!teamStats[team]) {
    teamStats[team] = {
      team,
      matches: [],
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    }
  }

  // Store match details
  teamStats[team].matches.push({
    date: match.date,
    opponent,
    goalsFor,
    goalsAgainst,
    result: goalsFor > goalsAgainst ? 'W' : goalsFor === goalsAgainst ? 'D' : 'L',
  })

  // Update stats
  teamStats[team].goalsFor += goalsFor
  teamStats[team].goalsAgainst += goalsAgainst

  if (goalsFor > goalsAgainst) {
    teamStats[team].wins += 1
    teamStats[team].points += 3
  } else if (goalsFor === goalsAgainst) {
    teamStats[team].draws += 1
    teamStats[team].points += 1
  } else {
    teamStats[team].losses += 1
  }
})

// Calculate derived stats
Object.values(teamStats).forEach((stats) => {
  const total = stats.matches.length
  stats.totalMatches = total
  stats.avgPoints = total > 0 ? (stats.points / total).toFixed(2) : 0
  stats.avgGoalsFor = total > 0 ? (stats.goalsFor / total).toFixed(2) : 0
  stats.avgGoalsAgainst = total > 0 ? (stats.goalsAgainst / total).toFixed(2) : 0
  stats.goalDifference = stats.goalsFor - stats.goalsAgainst
  stats.avgGoalDifference = total > 0 ? (stats.goalDifference / total).toFixed(2) : 0

  // Find first and last matches
  if (stats.matches.length > 0) {
    const sortedMatches = [...stats.matches].sort((a, b) => new Date(a.date) - new Date(b.date))
    stats.firstMatch = sortedMatches[0].date
    stats.lastMatch = sortedMatches[sortedMatches.length - 1].date
  }
})

// Sort by total matches descending
const sortedTeams = Object.values(teamStats).sort((a, b) => b.totalMatches - a.totalMatches)

// Console output
console.log('\n' + '='.repeat(100))
console.log('FIFA WORLD CUP 2026 - TEAM STATISTICS')
console.log('='.repeat(100) + '\n')

// Pad function
const pad = (str, len) => String(str).padEnd(len)

// Table header
console.log(
  pad('Team', 6) + pad('Matches', 9) + pad('First', 12) + pad('Last', 12) + pad('W', 4) +
  pad('D', 4) + pad('L', 4) + pad('GF', 5) + pad('GA', 5) + pad('GD', 5) + pad('Pts', 5) +
  pad('Avg Pts', 9) + pad('Avg GF', 9) + pad('Avg GA', 9)
)
console.log('-'.repeat(100))

sortedTeams.forEach((team) => {
  console.log(
    pad(team.team, 6) + pad(team.totalMatches.toString(), 9) + pad(team.firstMatch || '-', 12) +
    pad(team.lastMatch || '-', 12) + pad(team.wins.toString(), 4) + pad(team.draws.toString(), 4) +
    pad(team.losses.toString(), 4) + pad(team.goalsFor.toString(), 5) + pad(team.goalsAgainst.toString(), 5) +
    pad(team.goalDifference.toString(), 5) + pad(team.points.toString(), 5) + pad(team.avgPoints, 9) +
    pad(team.avgGoalsFor, 9) + pad(team.avgGoalsAgainst, 9)
  )
})

console.log('-'.repeat(100))

// Overall stats
const totalMatches = data.matches.length
const totalWins = Object.values(teamStats).reduce((sum, t) => sum + t.wins, 0)
const totalDraws = Object.values(teamStats).reduce((sum, t) => sum + t.draws, 0)
const totalLosses = Object.values(teamStats).reduce((sum, t) => sum + t.losses, 0)
const totalGoalsFor = Object.values(teamStats).reduce((sum, t) => sum + t.goalsFor, 0)
const totalGoalsAgainst = Object.values(teamStats).reduce((sum, t) => sum + t.goalsAgainst, 0)
const totalPoints = Object.values(teamStats).reduce((sum, t) => sum + t.points, 0)
const teamsWithData = Object.keys(teamStats).length

console.log(
  pad('TOTAL', 6) + pad(totalMatches.toString(), 9) + pad('', 12) + pad('', 12) +
  pad(totalWins.toString(), 4) + pad(totalDraws.toString(), 4) + pad(totalLosses.toString(), 4) +
  pad(totalGoalsFor.toString(), 5) + pad(totalGoalsAgainst.toString(), 5) +
  pad((totalGoalsFor - totalGoalsAgainst).toString(), 5) + pad(totalPoints.toString(), 5) +
  pad((totalPoints / totalMatches).toFixed(2), 9) + pad((totalGoalsFor / totalMatches).toFixed(2), 9) +
  pad((totalGoalsAgainst / totalMatches).toFixed(2), 9)
)

console.log('\n' + '='.repeat(100))
console.log('SUMMARY STATISTICS')
console.log('='.repeat(100))
console.log(`Total Teams with Data:        ${teamsWithData}`)
console.log(`Total Matches:                ${totalMatches}`)
console.log(`Total Wins:                   ${totalWins}`)
console.log(`Total Draws:                  ${totalDraws}`)
console.log(`Total Losses:                 ${totalLosses}`)
console.log(`Total Goals For:              ${totalGoalsFor}`)
console.log(`Total Goals Against:          ${totalGoalsAgainst}`)
console.log(`Total Points:                 ${totalPoints}`)
console.log(`Average Goals Per Match:      ${(totalGoalsFor / totalMatches).toFixed(2)}`)
console.log(`Average Points Per Team:      ${(totalPoints / teamsWithData).toFixed(2)}`)
console.log(`Average Matches Per Team:     ${(totalMatches / teamsWithData).toFixed(1)}`)
console.log('='.repeat(100) + '\n')

// Top performers
console.log('TOP 10 TEAMS BY MATCHES PLAYED')
console.log('-'.repeat(100))
console.log(
  pad('Rank', 6) + pad('Team', 6) + pad('Matches', 9) + pad('Wins', 6) + pad('Record', 20) + pad('Avg Points', 12)
)
console.log('-'.repeat(100))
sortedTeams.slice(0, 10).forEach((team, idx) => {
  const record = `${team.wins}W-${team.draws}D-${team.losses}L`
  console.log(pad((idx + 1).toString(), 6) + pad(team.team, 6) + pad(team.totalMatches.toString(), 9) + pad(team.wins.toString(), 6) + pad(record, 20) + pad(team.avgPoints, 12))
})

console.log('\n')

// Best goal scoring
console.log('TOP 10 TEAMS BY GOALS FOR (Total)')
console.log('-'.repeat(50))
const topGF = [...sortedTeams].sort((a, b) => b.goalsFor - a.goalsFor).slice(0, 10)
topGF.forEach((team, idx) => {
  console.log(`${(idx + 1).toString().padEnd(3)}. ${team.team} - ${team.goalsFor} goals (${team.avgGoalsFor} avg/match)`)
})

console.log('\n')

// Best defense
console.log('TOP 10 TEAMS BY GOALS AGAINST (Fewest)')
console.log('-'.repeat(50))
const topGA = [...sortedTeams].sort((a, b) => a.goalsAgainst - b.goalsAgainst).slice(0, 10)
topGA.forEach((team, idx) => {
  console.log(`${(idx + 1).toString().padEnd(3)}. ${team.team} - ${team.goalsAgainst} goals conceded (${team.avgGoalsAgainst} avg/match)`)
})

console.log('\n')

// Best points
console.log('TOP 10 TEAMS BY AVERAGE POINTS PER MATCH')
console.log('-'.repeat(50))
const topPoints = [...sortedTeams].sort((a, b) => parseFloat(b.avgPoints) - parseFloat(a.avgPoints)).slice(0, 10)
topPoints.forEach((team, idx) => {
  console.log(`${(idx + 1).toString().padEnd(3)}. ${team.team} - ${team.avgPoints} pts/match (${team.points} total in ${team.totalMatches} matches)`)
})

// Export JSON
const jsonOutput = {
  metadata: data.metadata,
  generatedAt: new Date().toISOString(),
  summary: {
    teamsWithData,
    totalMatches,
    totalWins,
    totalDraws,
    totalLosses,
    totalGoalsFor,
    totalGoalsAgainst,
    totalPoints,
    averageGoalsPerMatch: (totalGoalsFor / totalMatches).toFixed(2),
    averagePointsPerTeam: (totalPoints / teamsWithData).toFixed(2),
    averageMatchesPerTeam: (totalMatches / teamsWithData).toFixed(1),
  },
  teamStats: sortedTeams,
}

const outputPath = path.join(__dirname, 'wc26-stats.json')
fs.writeFileSync(outputPath, JSON.stringify(jsonOutput, null, 2))
console.log(`\n✓ Detailed stats exported to: ${outputPath}\n`)
