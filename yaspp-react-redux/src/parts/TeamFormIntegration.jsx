import * as React from 'react';
import { connect } from 'react-redux';
import TeamFormChart from './TeamFormChart';
import { getTeamFormForChart, getTeamInfo, getTeamFormStats } from './teamFormSelectors';
import './TeamFormChart.css';

/**
 * TeamFormIntegration - Connects TeamFormChart to Redux store
 * Use this component in your existing YASPP app
 */
const TeamFormIntegration = ({ 
  teamId, 
  formMatches, 
  teamInfo, 
  formStats,
  width = 400,
  height = 120,
  showHeader = true,
  showStats = true
}) => {
  if (!teamId || !formMatches || formMatches.length === 0) {
    return (
      <div className="team-form-integration-empty">
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          Select a team to view form chart
        </div>
      </div>
    );
  }

  return (
    <div className="team-form-integration">
      {showHeader && teamInfo && (
        <div className="team-form-header mb-3">
          <h5 className="mb-1">
            <i className="fas fa-chart-line me-2 text-primary"></i>
            {teamInfo.name} - Last 5 Matches Form
          </h5>
          {teamInfo.shortName && (
            <div className="text-muted small">
              Team Code: <span className="badge bg-secondary">{teamInfo.shortName}</span>
            </div>
          )}
        </div>
      )}
      
      <div className="team-form-chart-wrapper mb-3">
        <TeamFormChart 
          teamId={teamId}
          matches={formMatches}
          teamData={teamInfo}
          width={width}
          height={height}
        />
      </div>
      
      {showStats && formStats && (
        <div className="team-form-stats card">
          <div className="card-header py-2">
            <h6 className="mb-0">
              <i className="fas fa-calculator me-2"></i>
              Form Statistics
            </h6>
          </div>
          <div className="card-body py-3">
            <div className="row text-center">
              <div className="col">
                <div className="stat-value text-success">{formStats.wins}</div>
                <div className="stat-label small">Wins</div>
              </div>
              <div className="col">
                <div className="stat-value text-secondary">{formStats.draws}</div>
                <div className="stat-label small">Draws</div>
              </div>
              <div className="col">
                <div className="stat-value text-danger">{formStats.losses}</div>
                <div className="stat-label small">Losses</div>
              </div>
              <div className="col">
                <div className="stat-value text-primary">{formStats.points}</div>
                <div className="stat-label small">Points</div>
              </div>
              <div className="col">
                <div className="stat-value">{formStats.goalDifference > 0 ? `+${formStats.goalDifference}` : formStats.goalDifference}</div>
                <div className="stat-label small">Goal Diff</div>
              </div>
            </div>
            
            <div className="row mt-3 text-center">
              <div className="col">
                <div className="small text-muted">Goals For</div>
                <div className="fw-bold">{formStats.goalsFor} ({formStats.avgGoalsFor}/match)</div>
              </div>
              <div className="col">
                <div className="small text-muted">Goals Against</div>
                <div className="fw-bold">{formStats.goalsAgainst} ({formStats.avgGoalsAgainst}/match)</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Redux connection
const mapStateToProps = (state, ownProps) => {
  const { teamId } = ownProps;
  
  return {
    formMatches: getTeamFormForChart(state, teamId),
    teamInfo: getTeamInfo(state, teamId),
    formStats: getTeamFormStats(state, teamId)
  };
};

export default connect(mapStateToProps)(TeamFormIntegration);

// Also export a hook version for functional components
export const useTeamForm = (teamId) => {
  // This would be used with useSelector in functional components
  // Implementation depends on your Redux setup
  return {
    formMatches: [],
    teamInfo: null,
    formStats: null
  };
};