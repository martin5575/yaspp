import React from 'react'
import './Matchs.css'
import MatchsPerDay from './MatchsPerDay'
import { groupByFunc, sortByField } from '../utils/listUtils'
import { getKey, getShort, getDescription } from '../stats/statsType'
import { formatNumber } from '../maths/probabilities'

function Table(props) {
  const logoSize = 20
  const seasonInfo = props.seasonInfo
  const teams = props.teams
  const matchs = props.matchs
  const showAvg = props.showAvg

  const relevantTeams = matchs.flatMap(x=>[x.teamHomeId, x.teamAwayId]);
  const data = seasonInfo && seasonInfo.length ? seasonInfo : relevantTeams
    .map(x => ({
      team: x,
      tp: 0,
      tgf: 0,
      tga: 0,
      tgd: 0,
    }))

  const rawData = data.map((x) => ({
    ...x,
    iconUrl: teams[x.team].iconUrl,
    shortName: teams[x.team].shortName,
  }))
  const table = sortByField(rawData, ["tp","tgd","tgf"]).reverse()
  return (
    <table className="table table-striped">
  <thead>
    <tr key="table-header">
      <th scope="col">Team</th>
      <th scope="col">S</th>
      <th scope="col">P</th>
      <th scope="col">+/-</th>
      <th scope="col">T</th>
      <th scope="col">GT</th>
    </tr>
  </thead>
  <tbody>
    {table.map((team, index) => (<tr key={"table-"+team.shortName}>
      <td>          
        <img
            src={team.iconUrl}
            alt={team.shortName}
            height={logoSize}
            width={logoSize}
        />
      </td>
      <td>{team.tm}</td>
      <td>{!showAvg ? team.tp : formatNumber(team.tp / team.tm, 1)}</td>
      <td>{team.tgd}</td>
      <td>{!showAvg ? team.tgf : formatNumber(team.tgf / team.tm, 1)}</td>
      <td>{!showAvg ? team.tga : formatNumber(team.tga / team.tm, 1)}</td>
    </tr>))}
  </tbody>
</table>
  )
}

export default Table
