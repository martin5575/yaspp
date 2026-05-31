import * as React from 'react';
import { useMemo } from 'react';
import './TeamFormChart.css';

const TeamFormChart = ({
  teamId,
  matches,
  teamData = {},
  allTeams = [],
}) => {
  const formMatches = useMemo(() => {
    if (!matches || !teamId) return [];

    const teamMatches = matches
      .filter(match =>
        (match.teamHomeId === teamId || match.teamAwayId === teamId)
      )
      .sort((a, b) => new Date(b.matchDateTime) - new Date(a.matchDateTime))
      .slice(0, 5)
      .reverse();

    return teamMatches.map(match => {
      const isHome = match.teamHomeId === teamId;
      const opponentId = isHome ? match.teamAwayId : match.teamHomeId;
      const teamGoals = isHome ? match.fullTimeHome : match.fullTimeAway;
      const opponentGoals = isHome ? match.fullTimeAway : match.fullTimeHome;

      let result;
      if (teamGoals > opponentGoals) result = 'W';
      else if (teamGoals < opponentGoals) result = 'L';
      else result = 'D';

      const opponentInfo = allTeams.find(t => t.id === opponentId) || {};
      return {
        matchId: match.id,
        date: new Date(match.matchDateTime),
        isHome,
        opponent: {
          id: opponentId,
          name: opponentInfo.name || 'Unknown',
          shortName: opponentInfo.shortName || 'UNK',
          threeLetter: opponentInfo.threeLetter || opponentInfo.shortName?.substring(0, 3).toUpperCase() || 'UNK'
        },
        score: `${teamGoals}-${opponentGoals}`,
        result,
        competition: match.LeagueName || 'Bundesliga'
      };
    });
  }, [matches, teamId, allTeams]);

  if (!teamId || !matches || matches.length === 0) {
    return (
      <div className="team-form-chart-empty">
        <p>Keine Spieldaten verfügbar</p>
      </div>
    );
  }

  if (formMatches.length === 0) {
    return (
      <div className="team-form-chart-empty">
        <p>Nicht genug Spiele</p>
      </div>
    );
  }

  const winCount = formMatches.filter(m => m.result === 'W').length;
  const drawCount = formMatches.filter(m => m.result === 'D').length;
  const lossCount = formMatches.filter(m => m.result === 'L').length;

  return (
    <div className="team-form-chart-container">
      <div className="form-summary">
        <span className="form-w">{winCount}S</span>
        <span className="form-d">{drawCount}U</span>
        <span className="form-l">{lossCount}N</span>
      </div>
      <div className="form-matches">
        {formMatches.map((match, i) => (
          <div
            key={i}
            className="form-match"
            title={`${match.isHome ? 'Heim' : 'Auswärts'} vs ${match.opponent.name} | ${match.score} | ${match.date.toLocaleDateString('de-DE')} | ${match.competition}`}
          >
            <span className="form-venue">{match.isHome ? 'H' : 'A'}</span>
            <div className={`form-circle result-${match.result.toLowerCase()}`}>
              {match.result}
            </div>
            <span className="form-score">{match.score}</span>
            <span className="form-opponent">{match.opponent.threeLetter}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamFormChart;
