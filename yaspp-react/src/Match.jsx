import * as React from "react";
import { Component } from "react";
import MatchResult from "././MatchResult";

class Match extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-sm-8 label">
          {this.props.match.Team1.TeamName} - {this.props.match.Team2.TeamName}
        </div>
        <MatchResult
          matchResult={this.props.match.MatchResults.find(
            x => x.ResultName === "Endergebnis"
          )}
        />
      </div>
    );
  }
}

export default Match;
