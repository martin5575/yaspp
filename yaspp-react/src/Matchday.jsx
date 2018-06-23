import * as React from "react";
import { Component } from "react";
import DataService from "./DataService";
import Match from "./Match";

class MatchDay extends Component {
  state = { matchData: [] };

  componentWillMount() {
    const service = new DataService();
    service.getMatchDay("bl1", 2017, 1).then(res => {
      const matchData = res.data;
      this.setState({ matchData });
    });
  }

  render() {
    return <div>{this.state.matchData.map(x => <Match match={x} />)}</div>;
  }
}

export default MatchDay;
