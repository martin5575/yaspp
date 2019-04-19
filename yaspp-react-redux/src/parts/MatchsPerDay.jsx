import React from 'react'
import moment from 'moment'
import Match from './Match'
import './MatchsPerDay.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class MatchsPerDay extends React.Component {
  render() {
    const statsTitle = this.props.statsTitle
    const showPercentage = this.props.showPercentage
    return (
      <div key="this.props.date">
        <div>
          <table className="table">
            <thead>
              <tr className="d-flex">
                <th scope="col" className="col-5">
                  <small>
                    {moment(this.props.date).format('ddd DD.MM HH:mm')}
                  </small>
                </th>
                {statsTitle && (
                  <th scope="col" className="col-2 text-justify">
                    <small>
                      {statsTitle}
                      &nbsp;
                      <FontAwesomeIcon icon="info-circle" size="sm" />
                    </small>
                  </th>
                )}
                {statsTitle && (
                  <th scope="col" className="col-1 text-justify">
                    <small>1</small>
                  </th>
                )}
                {statsTitle && (
                  <th scope="col" className="col-1 text-justify">
                    <small>0</small>
                  </th>
                )}
                {statsTitle && (
                  <th scope="col" className="col-1 text-justify">
                    <small>2</small>
                  </th>
                )}
                {statsTitle && (
                  <th scope="col" className="col-1 text-justify" />
                )}
              </tr>
            </thead>
            <tbody>
              {this.props.matchs.map((m) => (
                <Match
                  match={m}
                  teams={this.props.teams}
                  seasonInfo={this.props.seasonInfo}
                  key={m.id}
                  showPercentage={showPercentage}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default MatchsPerDay
