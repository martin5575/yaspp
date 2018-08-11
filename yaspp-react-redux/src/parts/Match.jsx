import React from 'react'
import moment from 'moment'
import './Match.css'

class Match extends React.Component {
  logoSize = 20
  render() {
    const match = this.props.match
    const teams = this.props.teams
    return (
      <tr
        className="row"
        key={match.id}
        data-toggle="tooltip"
        title={
          'aktualisiert: ' +
          moment(match.lastUpdate).format('DD.Mmatch.YY HH:mm:ss')
        }
      >
        <td className="col-xs-1">
          {moment(match.matchDateTime).format('HH:mm')}
        </td>
        <td className="col-xs-1">
          <img
            src={teams[match.teamHomeId].iconUrl}
            alt={teams[match.teamHomeId].shortName}
            height={this.logoSize}
            width={this.logoSize}
          />
        </td>
        <td className="col-xs-1">:</td>
        <td className="col-xs-1">
          <img
            src={teams[match.teamAwayId].iconUrl}
            alt={teams[match.teamAwayId].shortName}
            height={this.logoSize}
            width={this.logoSize}
          />
        </td>
        <td className="col-xs-1">
          ({match.halfTimeHome}:{match.halfTimeAway})
        </td>
        <td className={'col-xs-1 ' + (match.isFinished ? 'final' : '')}>
          {match.fullTimeHome}:{match.fullTimeAway}
        </td>
      </tr>
    )
  }
}

export default Match
