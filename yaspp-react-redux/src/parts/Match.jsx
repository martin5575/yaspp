import React from 'react'
import moment from 'moment'
import './Match.css'
import { formatStats, calcStats } from '../utils/seasonInfo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Match extends React.Component {
  logoSize = 20
  render() {
    const match = this.props.match
    const teams = this.props.teams
    const seasonInfo = this.props.seasonInfo

    const teamHome = teams[match.teamHomeId]
    const teamAway = teams[match.teamAwayId]

    const stats = calcStats(
      seasonInfo,
      match.teamHomeId,
      match.teamAwayId,
      'hgf_agf_avg'
    )
    const digits = 1
    const formatedStats = formatStats(stats, digits)

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
            src={teamHome.iconUrl}
            alt={teamHome.shortName}
            height={this.logoSize}
            width={this.logoSize}
          />
        </td>
        <td className="col-xs-1">:</td>
        <td className="col-xs-1">
          <img
            src={teamAway.iconUrl}
            alt={teamAway.shortName}
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
        <td>
          <FontAwesomeIcon icon="angle-double-down" color="gray" />
        </td>
        <td className="col-xs-2">{formatedStats}</td>
      </tr>
    )
  }
}

export default Match
