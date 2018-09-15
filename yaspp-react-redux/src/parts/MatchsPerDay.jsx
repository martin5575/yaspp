import React from 'react'
import moment from 'moment'
import Match from './Match'
import './MatchsPerDay.css'

class MatchsPerDay extends React.Component {
  logoSize = 20
  render() {
    return (
      <div key="this.props.date">
        <span className="badge badge-light align-left">
          {moment(this.props.date).format('dddd DD.MM.YY')}
        </span>
        <table className="table">
          <tbody>
            {this.props.matchs.map((m) => (
              <Match
                match={m}
                teams={this.props.teams}
                seasonInfo={this.props.seasonInfo}
                key={m.id}
              />
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

export default MatchsPerDay
