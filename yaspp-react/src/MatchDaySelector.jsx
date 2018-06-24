import * as React from "react";
import { Component } from "react";

class MatchDaySelector extends Component {
  change(event) {
    const selectedDay = event.target.value;
    this.props.callback(selectedDay);
  }

  render() {
    return (
      <div>
        <select onChange={this.change.bind(this)}>
          {this.props.matchDays.map(x => (
            <option value={x} key={x}>
              {x}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export default MatchDaySelector;
