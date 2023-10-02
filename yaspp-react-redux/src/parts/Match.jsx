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
import { Button, Collapse } from 'reactstrap'
import { MatchProbabilityDetails } from './MatchProbabilityDetails'

const formatProbOrRate = (showPercentage, value) =>
  showPercentage ? formatPercentage(value) : formatRate(value)

class Match extends React.Component {
  logoSize = 20
  render() {


    const match = this.props.match
    const teams = this.props.teams
    const seasonInfo = this.props.seasonInfo
    const modelKey = this.props.modelKey
    const probabilityDetailsMatchId = this.props.probabilityDetailsMatchId;
    const isProbabilityDetailsShown = match.id===probabilityDetailsMatchId;
 

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
    console.log(match.id, probabilityDetailsMatchId)
    const showPercentage = this.props.showPercentage
    return (
      <>
      <div
        className="row"
        key={match.id}
        data-toggle="tooltip"
        title={
          'aktualisiert: ' +
          moment(match.lastUpdate).format('DD.MM.YY HH:mm:ss')
        }
      >
        <div className="col-2 pr-0">
          <img
            src={teamHome.iconUrl}
            alt={teamHome.shortName}
            height={this.logoSize}
            width={this.logoSize}
          />
          <img
            src={teamAway.iconUrl}
            alt={teamAway.shortName}
            height={this.logoSize}
            width={this.logoSize}
          />
        </div>
        <div className="col-1">
          <small>
            ({match.halfTimeHome}:{match.halfTimeAway})
          </small>
        </div>
        <div className="col-1">
          <small className={match.isFinished ? 'final ' : ''}>
            {match.fullTimeHome}:{match.fullTimeAway}
          </small>
        </div>
        <div className="col-1">
          <Button size='sm' color="link" onClick={()=>this.props.toggleProbabilityDetails(isProbabilityDetailsShown ? null: match.id)}>
            <FontAwesomeIcon icon="angle-double-down" color="gray" />
          </Button>
        </div>
        <div className="col-2 text-center">
          <small>
            <i>{formatedStats}</i>
          </small>
        </div>
        <div className="col-1 text-center">
          <small>
            <i>{formatProbOrRate(showPercentage, probs.win)}</i>
          </small>
        </div>
        <div className="col-1 text-center">
          <small>
            <i>{formatProbOrRate(showPercentage, probs.tie)}</i>
          </small>
        </div>
        <div className="col-1 text-center">
          <small>
            <i>{formatProbOrRate(showPercentage, probs.loss)}</i>
          </small>
        </div>
      </div>
      <div className="row">
        <Collapse className='col-12' isOpen={isProbabilityDetailsShown}>
          <MatchProbabilityDetails stats={stats} />
        </Collapse>
      </div>
      </>
    )
  }
}

export default Match
