import React from 'react'
import './Matchs.css'

export class MatchDetails extends React.Component {
    logoSize = 20

  details(teamId, teams, seasonInfo) {
    const team = teams[teamId]
    const info = seasonInfo.find(x=>x.team===teamId)
    return <div className='row'>
        <div className='col-2'>
            <img src={team.iconUrl} alt={team.name} 
                        height={this.logoSize}
                        width={this.logoSize}/>
        </div>
        {!info && (<div className='col-10'><i>no data</i></div>)}
        {info && (<>
            <div className='col-1'>
                <small>{info.tp}</small>
            </div>
            <div className='col-2'>
                <small>{info.tgf}:{info.tga}</small>
            </div>
            <div className='col-1'>
                <small>{info.hp}</small>
            </div>
            <div className='col-2'>
                <small>{info.hgf}:{info.hga}</small>
            </div>
            <div className='col-1'>
                <small>{info.ap}</small>
            </div>
            <div className='col-2'>
                <small>{info.agf}:{info.aga}</small>
            </div>
        </>)} 
    </div>
  }

  render() {
    const teams = this.props.teams;
    const match = this.props.match;
    const seasonInfo = this.props.seasonInfo;
    if (!teams || !match || !seasonInfo) return <div>empty</div>
    return <div className='container'>
        <div className='row'>
            <div className='col-2'><small>Team</small></div>
            <div className='col-3'><small>Gesamt</small></div>
            <div className='col-3'><small>Heim</small></div>
            <div className='col-3'><small>Auswärts</small></div>
        </div>
        {this.details(match.teamHomeId, teams, seasonInfo)}
        {this.details(match.teamAwayId, teams, seasonInfo)}
    </div>
  }
}
