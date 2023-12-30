import * as React from "react";
import { Component } from "react";
import DataService from "./DataService";
import Match from "./Match";
import MatchDaySelector from "./MatchDaySelector";

class MatchDay extends Component {
  constructor(props) {
    super(props);

    let matchDays = [];
    for (let i = 1; i <= 34; ++i) {
      matchDays.push(i);
    }

    this.state = {
      selectedMatchDay: 1,
      matchDays: matchDays,
      matches: []
    };
  }

  UNSAFE_componentWillMount () {
    this.update(1);
  }

  update(matchDay) {
    const service = new DataService();
    service.getMatchDay("bl1", 2017, matchDay).then(res => {
      const matches = res.data;
      let state = Object.assign({}, this.state);
      state.matches = matches;
      this.setState(state);
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-10">
            <b>Matchday &nbsp;</b>
            <MatchDaySelector
              callback={this.update.bind(this)}
              matchDays={this.state.matchDays}
              matchDay={this.state.selectedMatchDay}
            />
          </div>
        </div>
        <div>
          {this.state.matches.map(x => <Match match={x} key={x.MatchID} />)}
        </div>
      </div>
    );
  }
}

export default MatchDay;
