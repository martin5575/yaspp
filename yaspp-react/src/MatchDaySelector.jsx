import * as React from "react";
import { Component } from "react";

class MatchDaySelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matchDays: [],
      selectedDay: 0
    };
  }

  componentWillMount() {
    let matchDays = [];
    for (let i = 1; i <= 34; ++i) {
      matchDays.push(i);
    }
    const selectedDay = 1;
    this.setState({ matchDays, selectedDay });
  }

  change(event) {
    let state = Object.assign({}, this.state);
    state.selectedDay = event.target.value;
    console.log(state);
    this.setState(state);
    // this.props.selectedDay = event.target.value;
    this.props.callback(state.selectedDay);
  }

  render() {
    return (
      <div>
        <select onChange={this.change.bind(this)}>
          {this.state.matchDays.map(x => (
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
