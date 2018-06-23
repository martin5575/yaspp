import * as React from "react";
import { Component } from "react";
import DataService from "./DataService";

class MatchResult extends Component {
  render() {
    return (
      <div>
        {this.props.matchResult.PointsTeam1} {" - "}
        {this.props.matchResult.PointsTeam2}
      </div>
    );
  }
}

export default MatchResult;
