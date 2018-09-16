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
          <div className="col-xs-3 self-align-start">
            <span className="badge badge-light">
              {moment(this.props.date).format('dddd DD.MM.YY')}
            </span>
          </div>
          <div className="col-xs-3 col-xs-6-push">
            {statsTitle && (
              <div className="align-right">
                <span className="badge badge-secondary ">
                  {statsTitle} &nbsp;
                  <FontAwesomeIcon icon="info-circle" size="sm" />
                </span>
                &nbsp;
                <span className="badge badge-secondary">
                  {'1-'}
                  <FontAwesomeIcon icon="percentage" size="sm" />
                </span>
                <span className="badge badge-secondary">1</span>
                <span className="badge badge-secondary">0</span>
                <span className="badge badge-secondary">2</span>
              </div>
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
