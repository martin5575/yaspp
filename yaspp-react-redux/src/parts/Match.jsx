import React from 'react'
import moment from 'moment'
import './Match.css'
import { formatStats, calcStats } from '../utils/seasonInfo'
import {
  formatProbs,
  calcWinLossTieProbs,
  formatPercentage,
} from '../utils/probabilities'
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
    const probs = calcWinLossTieProbs(stats.home, stats.away)
    const formatedProbs = formatProbs(probs)

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
          <small>{moment(match.matchDateTime).format('HH:mm')}</small>
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
          <small>
            ({match.halfTimeHome}:{match.halfTimeAway})
          </small>
        </td>
        <td className={'col-xs-1 ' + match.isFinished ? 'final' : ''}>
          <small>
            {match.fullTimeHome}:{match.fullTimeAway}
          </small>
        </td>
        <td className="col-xs-1">
          <FontAwesomeIcon icon="angle-double-down" color="gray" />
        </td>
        <td className="col-xs-2">
          <small>
            <i>{formatedStats}</i>
          </small>
        </td>
        <td className="col-xs-1">
          <small>
            <i>{formatPercentage(probs.win)}</i>
          </small>
        </td>
        <td className="col-xs-1">
          <small>
            <i>{formatPercentage(probs.tie)}</i>
          </small>
        </td>
        <td className="col-xs-1">
          <small>
            <i>{formatPercentage(probs.loss)}</i>
          </small>
        </td>
        <td className="col-xs-1">
          <small>
            <FontAwesomeIcon icon="info-circle" />
          </small>
        </td>
      </tr>
    )
  }
}

export default Match
