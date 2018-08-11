import React from 'react'
import './Matchs.css'
import MatchsPerDay from './MatchsPerDay'
import { groupByFunc } from '../utils/listUtils'

class Matchs extends React.Component {
  logoSize = 20
  render() {
    const matchs = this.props.matchs
    const teams = this.props.teams
    if (!matchs || matchs.length === 0 || !teams) return <div>empty</div>

    const groupByMatchDay = groupByFunc(matchs, (x) =>
      x.matchDateTime.substring(0, 10)
    )
    const groupedMatchs = Object.entries(groupByMatchDay)
    return (
      <div className="mx-auto">
        {groupedMatchs.map((gm) => (
          <MatchsPerDay teams={teams} date={gm[0]} matchs={gm[1]} key={gm[0]} />
        ))}
      </div>
    )
  }
}

export default Matchs
