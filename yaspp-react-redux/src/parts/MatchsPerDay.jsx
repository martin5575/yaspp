import React from 'react'
import moment from 'moment'
import Match from './Match'
import './MatchsPerDay.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class MatchsPerDay extends React.Component {
  logoSize = 20
  render() {
    const statsTitle = this.props.statsTitle
    return (
      <div key="this.props.date">
        <div className="row">
          <div className="col self-align-start">
            <span className="badge badge-light align-left">
              {moment(this.props.date).format('dddd DD.MM.YY')}
            </span>
          </div>
          <div className="col self-align-end">
            {statsTitle && (
              <span className="badge badge-secondary align-right">
                {statsTitle} &nbsp;
                <FontAwesomeIcon icon="info-circle" size="sm" />
              </span>
            )}
          </div>
        </div>
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
