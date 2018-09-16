import React from 'react'
import './Matchs.css'
import MatchsPerDay from './MatchsPerDay'
import { groupByFunc } from '../utils/listUtils'

class Matchs extends React.Component {
  render() {
    const matchs = this.props.matchs
    const teams = this.props.teams
    const seasonInfo = this.props.seasonInfo
    if (!matchs || matchs.length === 0 || !teams) return <div>empty</div>

    const groupByMatchDay = groupByFunc(matchs, (x) =>
      x.matchDateTime.substring(0, 10)
    )
    const groupedMatchs = Object.entries(groupByMatchDay)
    return (
      <div className="mx-auto">
        {groupedMatchs.map((gm, i) => (
          <MatchsPerDay
            teams={teams}
            seasonInfo={seasonInfo}
            date={gm[0]}
            matchs={gm[1]}
            key={gm[0]}
            statsTitle={i === 0 ? 'h-a' : ''}
          />
        ))}
      </div>
    )
  }
}

export default Matchs
