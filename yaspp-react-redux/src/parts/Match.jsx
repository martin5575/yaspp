import React from 'react'
import moment from 'moment'
import './Match.css'
import { formatStats, calcStats } from '../stats/seasonInfo'
import {
  formatProbs,
  formatRate,
  calcWinLossTieProbs,
  formatPercentage,
  getProbDescription,
} from '../maths/probabilities'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const formatProbOrRate = (showPercentage, value) =>
  showPercentage ? formatPercentage(value) : formatRate(value)

class Match extends React.Component {
  logoSize = 20
  render() {
    const match = this.props.match
    const teams = this.props.teams
    const seasonInfo = this.props.seasonInfo
    const modelKey = this.props.modelKey

    const teamHome = teams[match.teamHomeId]
    const teamAway = teams[match.teamAwayId]

    const stats = calcStats(
      seasonInfo,
      match.teamHomeId,
      match.teamAwayId,
      modelKey
    )
    const digits = 1
    const formatedStats = formatStats(stats, digits)
    const probs = calcWinLossTieProbs(stats.home, stats.away)
    const formatedProbs = formatProbs(probs)
    console.log(formatedProbs)
    const showPercentage = this.props.showPercentage
    return (
      <tr
        className="d-flex"
        key={match.id}
        data-toggle="tooltip"
        title={
          'aktualisiert: ' +
          moment(match.lastUpdate).format('DD.MM.YY HH:mm:ss')
        }
      >
        <td className="col-2">
          <img
            src={teamHome.iconUrl}
            alt={teamHome.shortName}
            height={this.logoSize}
            width={this.logoSize}
          />
          <small>:</small>
          <img
            src={teamAway.iconUrl}
            alt={teamAway.shortName}
            height={this.logoSize}
            width={this.logoSize}
          />
        </td>
        <td className="col-1">
          <small>
            ({match.halfTimeHome}:{match.halfTimeAway})
          </small>
        </td>
        <td className="col-1">
          <small className={match.isFinished ? 'final ' : ''}>
            {match.fullTimeHome}:{match.fullTimeAway}
          </small>
        </td>
        <td className="col-1">
          <FontAwesomeIcon icon="angle-double-down" color="gray" />
        </td>
        <td className="col-2 text-center">
          <small>
            <i>{formatedStats}</i>
          </small>
        </td>
        <td className="col-1 text-center">
          <small>
            <i>{formatProbOrRate(showPercentage, probs.win)}</i>
          </small>
        </td>
        <td className="col-1 text-center">
          <small>
            <i>{formatProbOrRate(showPercentage, probs.tie)}</i>
          </small>
        </td>
        <td className="col-1 text-center">
          <small>
            <i>{formatProbOrRate(showPercentage, probs.loss)}</i>
          </small>
        </td>
        <td className="col-1 text-center">
          <a
            data-toggle="popover"
            title={`${teamHome.shortName}-${teamAway.shortName}`}
            data-html="true"
            data-container="body"
            data-placement="left"
            data-content={getProbDescription(stats.home, stats.away)}
          >
            <small>
              <FontAwesomeIcon icon="info-circle" />
            </small>
          </a>
        </td>
      </tr>
    )
  }
}

export default Match
