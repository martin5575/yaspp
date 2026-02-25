import * as React from 'react';
import { useState } from 'react';
import TeamFormChart from './TeamFormChart';
import './TeamFormChart.css';

/**
 * Demo component showing how to use TeamFormChart
 * Use this for testing and demonstration
 */
const TeamFormDemo = () => {
  // Sample data matching OpenLigaDB structure
  const sampleMatches = [
    {
      MatchID: 1,
      MatchDateTime: "2024-01-15T15:30:00",
      Team1: {
        TeamId: 100,
        TeamName: "Bayern Munich",
        ShortName: "FCB",
        TeamIconUrl: "https://example.com/fcb.png"
      },
      Team2: {
        TeamId: 200,
        TeamName: "Borussia Dortmund",
        ShortName: "BVB",
        TeamIconUrl: "https://example.com/bvb.png"
      },
      MatchResults: [
        {
          ResultName: "Endergebnis",
          PointsTeam1: 3,
          PointsTeam2: 1
        }
      ],
      LeagueName: "Bundesliga"
    },
    {
      MatchID: 2,
      MatchDateTime: "2024-01-08T15:30:00",
      Team1: {
        TeamId: 300,
        TeamName: "RB Leipzig",
        ShortName: "RBL",
        TeamIconUrl: "https://example.com/rbl.png"
      },
      Team2: {
        TeamId: 100,
        TeamName: "Bayern Munich",
        ShortName: "FCB",
        TeamIconUrl: "https://example.com/fcb.png"
      },
      MatchResults: [
        {
          ResultName: "Endergebnis",
          PointsTeam1: 2,
          PointsTeam2: 2
        }
      ],
      LeagueName: "Bundesliga"
    },
    {
      MatchID: 3,
      MatchDateTime: "2024-01-01T15:30:00",
      Team1: {
        TeamId: 100,
        TeamName: "Bayern Munich",
        ShortName: "FCB",
        TeamIconUrl: "https://example.com/fcb.png"
      },
      Team2: {
        TeamId: 400,
        TeamName: "Eintracht Frankfurt",
        ShortName: "SGE",
        TeamIconUrl: "https://example.com/sge.png"
      },
      MatchResults: [
        {
          ResultName: "Endergebnis",
          PointsTeam1: 1,
          PointsTeam2: 0
        }
      ],
      LeagueName: "Bundesliga"
    },
    {
      MatchID: 4,
      MatchDateTime: "2023-12-20T15:30:00",
      Team1: {
        TeamId: 500,
        TeamName: "VfB Stuttgart",
        ShortName: "VFB",
        TeamIconUrl: "https://example.com/vfb.png"
      },
      Team2: {
        TeamId: 100,
        TeamName: "Bayern Munich",
        ShortName: "FCB",
        TeamIconUrl: "https://example.com/fcb.png"
      },
      MatchResults: [
        {
          ResultName: "Endergebnis",
          PointsTeam1: 0,
          PointsTeam2: 3
        }
      ],
      LeagueName: "Bundesliga"
    },
    {
      MatchID: 5,
      MatchDateTime: "2023-12-15T15:30:00",
      Team1: {
        TeamId: 100,
        TeamName: "Bayern Munich",
        ShortName: "FCB",
        TeamIconUrl: "https://example.com/fcb.png"
      },
      Team2: {
        TeamId: 600,
        TeamName: "1. FC Union Berlin",
        ShortName: "FCU",
        TeamIconUrl: "https://example.com/fcu.png"
      },
      MatchResults: [
        {
          ResultName: "Endergebnis",
          PointsTeam1: 2,
          PointsTeam2: 1
        }
      ],
      LeagueName: "Bundesliga"
    }
  ];

  const sampleTeamData = {
    id: 100,
    name: "Bayern Munich",
    shortName: "FCB",
    logo: "https://example.com/fcb.png"
  };

  const [chartWidth, setChartWidth] = useState(400);
  const [chartHeight, setChartHeight] = useState(120);
  const [showTeamName, setShowTeamName] = useState(true);

  return (
    <div className="team-form-demo">
      <div className="demo-header">
        <h3>Team Form Chart Demo</h3>
        <p className="text-muted">
          Interactive D3.js visualization of team's last 5 matches
        </p>
      </div>

      <div className="demo-controls card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Chart Controls</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <label className="form-label">Width: {chartWidth}px</label>
              <input
                type="range"
                className="form-range"
                min="300"
                max="800"
                step="50"
                value={chartWidth}
                onChange={(e) => setChartWidth(parseInt(e.target.value))}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Height: {chartHeight}px</label>
              <input
                type="range"
                className="form-range"
                min="100"
                max="200"
                step="10"
                value={chartHeight}
                onChange={(e) => setChartHeight(parseInt(e.target.value))}
              />
            </div>
            <div className="col-md-4">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="showTeamName"
                  checked={showTeamName}
                  onChange={(e) => setShowTeamName(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="showTeamName">
                  Show Team Name
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="demo-chart card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Bayern Munich - Last 5 Matches Form</h5>
        </div>
        <div className="card-body">
          <TeamFormChart
            teamId={100}
            matches={sampleMatches}
            teamData={showTeamName ? sampleTeamData : {}}
            width={chartWidth}
            height={chartHeight}
          />
          
          <div className="demo-legend mt-4">
            <div className="row">
              <div className="col-auto">
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#4CAF50' }}></div>
                  <span className="legend-label">Win (W)</span>
                </div>
              </div>
              <div className="col-auto">
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#9E9E9E' }}></div>
                  <span className="legend-label">Draw (D)</span>
                </div>
              </div>
              <div className="col-auto">
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#F44336' }}></div>
                  <span className="legend-label">Loss (L)</span>
                </div>
              </div>
              <div className="col-auto">
                <div className="legend-item">
                  <div className="legend-badge bg-secondary">H</div>
                  <span className="legend-label">Home Match</span>
                </div>
              </div>
              <div className="col-auto">
                <div className="legend-item">
                  <div className="legend-badge bg-light text-dark">A</div>
                  <span className="legend-label">Away Match</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="demo-instructions card">
        <div className="card-header">
          <h5 className="mb-0">How to Use</h5>
        </div>
        <div className="card-body">
          <ol>
            <li>
              <strong>Hover over circles</strong> to see match details
            </li>
            <li>
              <strong>Adjust sliders</strong> to change chart size
            </li>
            <li>
              <strong>Read the chart</strong>:
              <ul>
                <li>Green circle = Win, Gray = Draw, Red = Loss</li>
                <li>Letter inside circle shows result (W/D/L)</li>
                <li>Score shown below each circle</li>
                <li>Opponent abbreviation below score</li>
                <li>H/A indicator above circle shows Home/Away</li>
              </ul>
            </li>
            <li>
              <strong>Form summary</strong> shows wins/draws/losses count
            </li>
          </ol>
          
          <div className="alert alert-info mt-3">
            <i className="fas fa-lightbulb me-2"></i>
            <strong>Tip:</strong> This chart integrates seamlessly with your existing YASPP Redux state.
            See <code>INTEGRATION_GUIDE.md</code> for implementation details.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamFormDemo;