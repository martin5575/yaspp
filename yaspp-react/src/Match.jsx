import * as React from "react";
import { Component } from "react";
import MatchResult from "./MatchResult";

class Match extends Component {
  render() {
    const m = this.props.match || {};
    const team1Name = m.Team1?.TeamName || m.Team1?.teamName || "?";
    const team2Name = m.Team2?.TeamName || m.Team2?.teamName || "?";
    const results = Array.isArray(m.MatchResults) ? m.MatchResults : [];
    const matchResult = results.find((x) => x.ResultName === "Endergebnis") || results[0] || null;
    return (
      <div className="row">
        <div className="col-sm-8 label">
          {team1Name} - {team2Name}
        </div>
        <MatchResult matchResult={matchResult} />
      </div>
    );
  }
}

export default Match;
