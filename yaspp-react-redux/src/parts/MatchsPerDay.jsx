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
        <table className="table">
          <thead>
            <tr>
              <th colSpan={7}>
                <span className="badge badge-light">
                  {moment(this.props.date).format('dddd DD.MM.YY')}
                </span>
              </th>
              <th>
                {statsTitle && (
                  <td>
                    <span className="badge badge-secondary ">
                      {statsTitle} &nbsp;
                      <FontAwesomeIcon icon="info-circle" size="sm" />
                    </span>
                  </td>
                )}
                {statsTitle && (
                  <td>
                    <span className="badge badge-secondary">1</span>
                  </td>
                )}
                {statsTitle && (
                  <td>
                    <span className="badge badge-secondary">0</span>
                  </td>
                )}
                {statsTitle && (
                  <td>
                    <span className="badge badge-secondary">2</span>
                  </td>
                )}
              </th>
            </tr>
          </thead>
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
