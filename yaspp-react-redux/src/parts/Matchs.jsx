import React from 'react'
import './Matchs.css'
import MatchsPerDay from './MatchsPerDay'
import { groupByFunc, sortByField } from '../utils/listUtils'
import { getKey, getShort, getDescription } from '../stats/statsType'

class Matchs extends React.Component {
  render() {
    const matchs = this.props.matchs
    const teams = this.props.teams
    const seasonInfo = this.props.seasonInfo
    const showPercentage = this.props.showPercentage
    if (!matchs || matchs.length === 0 || !teams) return <div>empty</div>

    const groupByMatchDay = groupByFunc(matchs, (x) =>
      x.matchDateTime
    )

    // @ts-ignore
    const groupedMatchs = Object.entries(groupByMatchDay)
    sortByField(groupedMatchs, '0')

    const selectedModelId = this.props.selectedModelId
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
            probabilityDetailsMatchId={this.props.probabilityDetailsMatchId}
            toggleProbabilityDetails={this.props.toggleProbabilityDetails}
          />
        ))}
      </div>
    )
  }
}

export default Matchs
