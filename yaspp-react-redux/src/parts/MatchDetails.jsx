import React from 'react'
import './MatchDetails.css'
import { Button, Card,CardBody, CardTitle } from 'reactstrap'
import { MatchDetailsHeatmap } from './MatchDetailsHeatmap'
import { MatchDetailsTop3 } from './MatchDetailsTop3'
import { MatchDetailsKicktippTop3 } from './MatchDetailsKicktippTop3'
import { MatchDetailsPlusMinus } from './MatchDetailsPlusMinus'
import { MatchDetailsStats } from './MatchDetailsStats'

export class MatchDetails extends React.Component {
    logoSize = 30

  render() {
    const teams = this.props.teams;
    const match = this.props.match;
    const seasonInfo = this.props.seasonInfo;
    const stats = this.props.stats;
    const modelKey = this.props.modelKey;
    if (!teams || !match || !seasonInfo) return <div>empty</div>

    const teamHome = teams[match.teamHomeId]
    const teamAway = teams[match.teamAwayId]
    return <Card>
<CardBody>
<CardTitle tag="h5">
Match Details
<img src={teamHome.iconUrl} alt={teamHome.name} 
                        height={this.logoSize}
                        width={this.logoSize}/>
<img src={teamAway.iconUrl} alt={teamAway.name} 
                        height={this.logoSize}
                        width={this.logoSize}/>
</CardTitle>
    <MatchDetailsStats teams={teams} match={match} seasonInfo={seasonInfo} modelKey={modelKey} /> 
    <MatchDetailsTop3 stats={stats} />
    <MatchDetailsKicktippTop3 stats={stats} />
    <MatchDetailsPlusMinus stats={stats} />
    <MatchDetailsHeatmap stats={stats} />


</CardBody>
</Card>  
  }
}
