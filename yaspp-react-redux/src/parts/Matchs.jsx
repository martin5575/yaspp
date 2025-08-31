import React from 'react'
import './Matchs.css'
import MatchsPerDay from './MatchsPerDay'
import { groupByFunc, sortByField } from '../utils/listUtils'
import { getKey, getShort, getDescription } from '../stats/statsType'

function Matchs(props) {
  const { matchs, teams, seasonInfo, showPercentage } = props
  if (!matchs || matchs.length === 0 || !teams) return <div>empty</div>

  const groupByMatchDay = groupByFunc(matchs, (x) => x.matchDateTime)
  const groupedMatchs = Object.entries(groupByMatchDay)
  sortByField(groupedMatchs, '0')

  const selectedModelId = props.selectedModelId
  const modelKey = getKey(selectedModelId)
  const statsHeader = getShort(modelKey)
  const statsDescription = getDescription(modelKey)

  return (
    <div className="container-fluid schedule">
      {groupedMatchs.map((gm, i) => (
        <MatchsPerDay
          teams={teams}
          seasonInfo={seasonInfo}
          date={gm[0]}
          matchs={gm[1]}
          key={gm[0]}
          statsTitle={i === 0 ? statsHeader : ''}
          statsDescription={statsDescription}
          selectedModelId={selectedModelId}
          showPercentage={showPercentage}
          probabilityDetailsMatchId={props.probabilityDetailsMatchId}
          toggleProbabilityDetails={props.toggleProbabilityDetails}
        />
      ))}
    </div>
  )
}

export default Matchs
