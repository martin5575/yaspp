import * as React from "react";
import { Component } from "react";

class MatchResult extends Component {
  render() {
  const r = this.props.matchResult;
    return (
      <div className="col-sm-2">
    {r ? r.PointsTeam1 : "?"} {" - "}
    {r ? r.PointsTeam2 : "?"}
      </div>
    );
  }
}

export default MatchResult;
