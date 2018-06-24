import * as React from "react";
import { Component } from "react";
import "./App.css";
import MatchDay from "./MatchDay";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>Welcome to YASPP!</h1>
          <h2>[Yet Another SPorts Page]</h2>
        </div>
        <MatchDay />
      </div>
    );
  }
}

export default App;
