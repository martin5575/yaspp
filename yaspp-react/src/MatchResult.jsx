import * as React from "react";
import { Component } from "react";

class MatchResult extends Component {
  render() {
    return (
      <div className="col-sm-2">
        {this.props.matchResult.PointsTeam1} {" - "}
        {this.props.matchResult.PointsTeam2}
      </div>
    );
  }
}

export default MatchResult;
