import * as React from "react";
import { Component } from "react";

class MatchDaySelector extends Component {
  change(event) {
    const selectedDay = Number(event.target.value);
    this.props.callback(selectedDay);
  }

  render() {
    return (
      <select className="dropdown" value={this.props.matchDay} onChange={this.change.bind(this)}>
        {this.props.matchDays.map((x) => (
          <option value={x} key={`md-${x}`}>
            {x}
          </option>
        ))}
      </select>
    );
  }
}

export default MatchDaySelector;
