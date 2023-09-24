import React from 'react'
import './Matchs.css'
import MatchsPerDay from './MatchsPerDay'
import { groupByFunc, sortByField } from '../utils/listUtils'
import { getKey, getShort, getDescription } from '../stats/statsType'

class Table extends React.Component {
  logoSize = 20

  render() {
    const seasonInfo = this.props.seasonInfo
    const teams = this.props.teams
    //const selectedModelId = this.props.selectedModelId
 
    const rawData = seasonInfo.map((x) => ({
      ...x,
      iconUrl: teams[x.team].iconUrl,
      shortName: teams[x.team].shortName,
    }))

    const table = sortByField(rawData, "tp").reverse()
    return (
      <table class="table table-striped">
  <thead>
    <tr>
      <th scope="col">Team</th>
      <th scope="col">P</th>
      <th scope="col">TG</th>
      <th scope="col">TA</th>
    </tr>
  </thead>
  <tbody>
    {table.map((team, index) => (<tr>
      <td>          
        <img
            src={team.iconUrl}
            alt={team.shortName}
            height={this.logoSize}
            width={this.logoSize}
        />
      </td>
      <td>{team.tp}</td>
      <td>{team.tgf}</td>
      <td>{team.tga}</td>
    </tr>))}
  </tbody>
</table>
    )
  }
}

export default Table
