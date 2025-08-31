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
import { MatchDetails } from './MatchDetails'
import { getKey, getShort, getDescription } from '../stats/statsType'


const formatProbOrRate = (showPercentage, value) =>
  showPercentage ? formatPercentage(value) : formatRate(value)

function Match(props) {
  const logoSize = 20
  const match = props.match
  const teams = props.teams
  const seasonInfo = props.seasonInfo
  const selectedModelId = props.selectedModelId
  const probabilityDetailsMatchId = props.probabilityDetailsMatchId
  const isProbabilityDetailsShown = match.id === probabilityDetailsMatchId

  const teamHome = teams[match.teamHomeId]
  const teamAway = teams[match.teamAwayId]

  const modelKey = getKey(selectedModelId)
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
  const showPercentage = props.showPercentage
  return (
    <>
      <div
        className="row match-row align-items-baseline g-0"
        key={match.id}
        data-toggle="tooltip"
        title={
          'aktualisiert: ' +
          moment(match.lastUpdate).format('DD.MM.YY HH:mm:ss')
        }
      >
        <div className="col-2 p-0 match-logos">
          <img
            src={teamHome.iconUrl}
            alt={teamHome.shortName}
            height={logoSize}
            width={logoSize}
          />
          <img
            src={teamAway.iconUrl}
            alt={teamAway.shortName}
            height={logoSize}
            width={logoSize}
          />
        </div>
        <div className="col-1 p-0 match-half">
          <small>
            ({match.halfTimeHome}:{match.halfTimeAway})
          </small>
        </div>
        <div className="col-1 p-0 match-final">
          <small className={match.isFinished ? 'final ' : ''}>
            {match.fullTimeHome}:{match.fullTimeAway}
          </small>
        </div>
  <div className="col-1 p-0 match-toggle">
          <Button size='sm' color="link" onClick={()=>props.toggleProbabilityDetails(isProbabilityDetailsShown ? null: match.id)}>
            <FontAwesomeIcon icon="angle-double-down" color="gray" />
          </Button>
        </div>
        <div className="col-2 text-center p-0 match-stats">
          <small>
            <i>{formatedStats}</i>
          </small>
        </div>
        <div className="col-1 text-center p-0 match-prob">
          <small>
            <i>{formatProbOrRate(showPercentage, probs.win)}</i>
          </small>
        </div>
        <div className="col-1 text-center p-0 match-prob">
          <small>
            <i>{formatProbOrRate(showPercentage, probs.tie)}</i>
          </small>
        </div>
        <div className="col-1 text-center p-0 match-prob">
          <small>
            <i>{formatProbOrRate(showPercentage, probs.loss)}</i>
          </small>
        </div>
      </div>
      <div className="row">
        <Collapse className='col-12' isOpen={isProbabilityDetailsShown}>
          <MatchDetails className="p-1" match={match} teams={teams} seasonInfo={seasonInfo} selectedModelId={selectedModelId} stats={stats}/>
        </Collapse>
      </div>
  </>
  )
}

export default Match
