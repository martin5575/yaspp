/**
 * Selectors for team form data extraction from Redux state
 * Compatible with YASPP React+Redux state structure
 * Simplified version without reselect dependency
 */

/**
 * Get all matches for a specific team
 */
export const getTeamMatches = (state, teamId) => {
  const matchs = state?.model?.matchs || [];
  if (!matchs || !teamId) return [];
  
  return matchs.filter(match => 
    (match.Team1?.TeamId === teamId || match.Team2?.TeamId === teamId) &&
    match.MatchResults?.length > 0
  );
};

/**
 * Get team information by ID
 */
export const getTeamInfo = (state, teamId) => {
  const teams = state?.model?.teams || [];
  if (!teams || !teamId) return null;
  
  const team = teams.find(t => t.TeamId === teamId);
  if (!team) return null;
  
  return {
    id: team.TeamId,
    name: team.TeamName || team.teamName,
    shortName: team.ShortName || team.shortName || team.TeamName?.substring(0, 3).toUpperCase(),
    logo: team.TeamIconUrl || team.teamIconUrl
  };
};

/**
 * Calculate form statistics for a team
 */
export const getTeamFormStats = (state, teamId) => {
  const teamMatches = getTeamMatches(state, teamId);
  const last5Matches = teamMatches
    .sort((a, b) => new Date(b.MatchDateTime) - new Date(a.MatchDateTime))
    .slice(0, 5);
  
  let wins = 0, draws = 0, losses = 0;
  let goalsFor = 0, goalsAgainst = 0;
  
  last5Matches.forEach(match => {
    const isHome = match.Team1?.TeamId === teamId;
    const teamGoals = isHome ? 
      (match.MatchResults.find(r => r.ResultName === 'Endergebnis')?.PointsTeam1 || 0) :
      (match.MatchResults.find(r => r.ResultName === 'Endergebnis')?.PointsTeam2 || 0);
    const opponentGoals = isHome ? 
      (match.MatchResults.find(r => r.ResultName === 'Endergebnis')?.PointsTeam2 || 0) :
      (match.MatchResults.find(r => r.ResultName === 'Endergebnis')?.PointsTeam1 || 0);
    
    goalsFor += teamGoals;
    goalsAgainst += opponentGoals;
    
    if (teamGoals > opponentGoals) wins++;
    else if (teamGoals < opponentGoals) losses++;
    else draws++;
  });
  
  return {
    matchesPlayed: last5Matches.length,
    wins,
    draws,
    losses,
    goalsFor,
    goalsAgainst,
    goalDifference: goalsFor - goalsAgainst,
    points: (wins * 3) + draws,
    form: `${wins}W ${draws}D ${losses}L`,
    avgGoalsFor: last5Matches.length > 0 ? (goalsFor / last5Matches.length).toFixed(1) : 0,
    avgGoalsAgainst: last5Matches.length > 0 ? (goalsAgainst / last5Matches.length).toFixed(1) : 0
  };
};

/**
 * Get form matches ready for chart display
 */
export const getTeamFormForChart = (state, teamId) => {
  const teamMatches = getTeamMatches(state, teamId);
  const teamInfo = getTeamInfo(state, teamId);
  
  if (!teamMatches || teamMatches.length === 0 || !teamInfo) return [];
  
  const last5Matches = teamMatches
    .sort((a, b) => new Date(b.MatchDateTime) - new Date(a.MatchDateTime))
    .slice(0, 5)
    .reverse();
  
  return last5Matches.map(match => {
    const isHome = match.Team1?.TeamId === teamInfo.id;
    const opponent = isHome ? match.Team2 : match.Team1;
    const teamGoals = isHome ? 
      (match.MatchResults.find(r => r.ResultName === 'Endergebnis')?.PointsTeam1 || 0) :
      (match.MatchResults.find(r => r.ResultName === 'Endergebnis')?.PointsTeam2 || 0);
    const opponentGoals = isHome ? 
      (match.MatchResults.find(r => r.ResultName === 'Endergebnis')?.PointsTeam2 || 0) :
      (match.MatchResults.find(r => r.ResultName === 'Endergebnis')?.PointsTeam1 || 0);
    
    let result;
    if (teamGoals > opponentGoals) result = 'W';
    else if (teamGoals < opponentGoals) result = 'L';
    else result = 'D';
    
    const opponentInfo = {
      id: opponent?.TeamId,
      name: opponent?.TeamName || opponent?.teamName || 'Unknown',
      shortName: opponent?.ShortName || opponent?.shortName || 
                (opponent?.TeamName?.substring(0, 3).toUpperCase() || 'UNK')
    };
    
    return {
      matchId: match.MatchID,
      date: new Date(match.MatchDateTime),
      isHome,
      opponent: opponentInfo,
      score: `${teamGoals}-${opponentGoals}`,
      result,
      teamGoals,
      opponentGoals,
      competition: match.LeagueName || 'Bundesliga',
      venue: isHome ? 'Home' : 'Away'
    };
  });
};

/**
 * Get current form streak
 */
export const getCurrentFormStreak = (state, teamId) => {
  const formMatches = getTeamFormForChart(state, teamId);
  if (!formMatches || formMatches.length === 0) return { type: 'none', length: 0 };
  
  let currentStreak = 1;
  const firstResult = formMatches[formMatches.length - 1]?.result;
  
  for (let i = formMatches.length - 2; i >= 0; i--) {
    if (formMatches[i].result === firstResult) {
      currentStreak++;
    } else {
      break;
    }
  }
  
  return {
    type: firstResult,
    length: currentStreak,
    description: `${currentStreak} ${firstResult === 'W' ? 'wins' : firstResult === 'D' ? 'draws' : 'losses'} in a row`
  };
};