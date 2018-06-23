import * as React from "react";
import { Component } from "react";
import MatchResult from "././MatchResult";

class Match extends Component {
  render() {
    return (
      <div>
        <div>
          {this.props.match.Team1.TeamName} - {this.props.match.Team2.TeamName}
        </div>
        <div>
          <MatchResult
            matchResult={this.props.match.MatchResults.find(
              x => x.ResultName === "Endergebnis"
            )}
          />
        </div>
      </div>
    );
  }
}

export default Match;
