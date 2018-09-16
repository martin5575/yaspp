import React from 'react'
import moment from 'moment'
import Match from './Match'
import './MatchsPerDay.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class MatchsPerDay extends React.Component {
  render() {
    const statsTitle = this.props.statsTitle
    return (
      <div key="this.props.date">
        <div>
          <table className="table">
            <thead>
              <tr className="row">
                <th scope="col" className="col-6">
                  <small>
                    {moment(this.props.date).format('dddd DD.MM.YY')}
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
