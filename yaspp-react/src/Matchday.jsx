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

  componentDidMount() {
    this.update(1);
  }

  update(matchDay) {
    const md = Number(matchDay);
    const service = new DataService();
    service
      .getMatchDay("bl1", 2017, md)
      .then((res) => {
        const data = res && res.data;
        const matches = Array.isArray(data) ? data : [];
        this.setState({ selectedMatchDay: md, matches });
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error("Failed to load matches", err);
        this.setState({ selectedMatchDay: md, matches: [] });
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
          {Array.isArray(this.state.matches) && this.state.matches.map((x, i) => (
            <Match
              match={x}
              key={
                x.MatchID ??
                x.MatchIDTeam1 ??
                `${x.Team1?.TeamName || x.Team1?.teamName || 't1'}-${x.Team2?.TeamName || x.Team2?.teamName || 't2'}-${x.MatchDateTime || 'date'}-${i}`
              }
            />
          ))}
        </div>
      </div>
    );
  }
}

export default MatchDay;
