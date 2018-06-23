import * as React from "react";
import { Component } from "react";
import DataService from "./DataService";

class Matchday extends Component {
  state = { matchData: [] };

  componentWillMount() {
    const service = new DataService();
    service.getMatchDay("bl1", 2017, 1).then(res => {
      const matchData = res.data;
      this.setState({ matchData });
    });
  }

  render() {
    return (
      <div>
        {this.state.matchData.map(x => (
          <div>
            <div>
              {x.Team1.TeamName} - {x.Team2.TeamName}
            </div>
            <div>
              {
                x.MatchResults.find(x => x.ResultName === "Endergebnis")
                  .PointsTeam1
              }
              {" - "}
              {
                x.MatchResults.find(x => x.ResultName === "Endergebnis")
                  .PointsTeam2
              }
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default Matchday;
