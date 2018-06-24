import * as React from "react";
import { Component } from "react";
import DataService from "./DataService";
import Match from "./Match";
import MatchDaySelector from "./MatchDaySelector";

class MatchDay extends Component {
  state = {
    matchDay: 1,
    matchData: []
  };

  componentWillMount() {
    this.update(1);
  }

  update(matchDay) {
    //const matchDay = this.state.matchDay;
    console.log(matchDay);
    const service = new DataService();
    service.getMatchDay("bl1", 2017, matchDay).then(res => {
      const matchData = res.data;
      this.setState({ matchData });
    });
  }

  render() {
    console.log("render Matchday");
    return (
      <div>
        <div>
          <MatchDaySelector
            callback={this.update.bind(this)}
            matchDay={this.state.matchDay}
          />
        </div>
        <div>Matchday {this.state.matchDay}</div>
        <div>
          {this.state.matchData.map(x => <Match match={x} key={x.MatchID} />)}
        </div>
      </div>
    );
  }
}

export default MatchDay;
