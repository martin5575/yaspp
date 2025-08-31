import React from 'react'
import moment from 'moment'
import Match from './Match'
import './MatchsPerDay.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function MatchsPerDay(props) {
  const statsTitle = props.statsTitle
  const statsDescription = props.statsDescription
  const showPercentage = props.showPercentage
  return (
    <>
  <div className="row match-header align-items-baseline g-0" key="this.props.date">
        <div scope="col" className="col-5 match-date">
          <small>
            {moment(props.date).format('ddd DD.MM HH:mm')}
          </small>
        </div>
        {statsTitle && (
          <div scope="col" className="col-2 text-center p-0 match-title">
            <small>
              {statsTitle}
              &nbsp;
              <FontAwesomeIcon icon="info-circle" size="sm" />
            </small>
          </div>
        )}
        {statsTitle && (
          <div scope="col" className="col-1 text-center p-0 match-col-head">
            <small>1</small>
          </div>
        )}
        {statsTitle && (
          <div scope="col" className="col-1 text-center p-0 match-col-head">
            <small>0</small>
          </div>
        )}
        {statsTitle && (
          <div scope="col" className="col-1 text-center p-0 match-col-head">
            <small>2</small>
          </div>
        )}
        {statsTitle && (
          <div scope="col" className="col-1 text-center p-0 match-col-head" />
        )}
      </div>
      {props.matchs.map((m) => (
        <Match
          match={m}
          teams={props.teams}
          seasonInfo={props.seasonInfo}
          key={m.id}
          showPercentage={showPercentage}
          selectedModelId={props.selectedModelId}
          probabilityDetailsMatchId={props.probabilityDetailsMatchId}
          toggleProbabilityDetails={props.toggleProbabilityDetails}
        />
      ))}
    </>
  )
}

export default MatchsPerDay
