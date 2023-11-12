import React from 'react'
import './MatchDetailsStats.css'

export class MatchDetailsStats extends React.Component {
    logoSize = 20

  details(teamId, teams, seasonInfo, modelKey, isHomeTeam) {
    const team = teams[teamId]
    const info = seasonInfo.find(x=>x.team===teamId)
    console.log(modelKey)
    const total = ["tg_vs_tg", "tgdf_vs_tgdf"].includes(modelKey)
    const home = ["hg_vs_ag", "hgdf_vs_agdf"].includes(modelKey) && isHomeTeam
    const away = ["hg_vs_ag", "hgdf_vs_agdf"].includes(modelKey) && !isHomeTeam

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
            <div className="col-2">
                <small className={`${total ? 'bold' : ''}`}>{info.tgf}:{info.tga}</small>
            </div>
            <div className='col-1'>
                <small>{info.hp}</small>
            </div>
            <div className='col-2'>
                <small className={`${home ? 'bold' : ''}`}>{info.hgf}:{info.hga}</small>
            </div>
            <div className='col-1'>
                <small>{info.ap}</small>
            </div>
            <div className='col-2'>
                <small className={`${away ? 'bold' : ''}`}>{info.agf}:{info.aga}</small>
            </div>
        </>)} 
    </div>
  }

  render() {
    const teams = this.props.teams;
    const match = this.props.match;
    const seasonInfo = this.props.seasonInfo;
    const modelKey = this.props.modelKey;
    if (!teams || !match || !seasonInfo) return <div>empty</div>
    return <div className='container'>
        <div className='row'>
            <div className='col-2'><small>Team</small></div>
            <div className='col-3'><small>Gesamt</small></div>
            <div className='col-3'><small>Heim</small></div>
            <div className='col-3'><small>Auswärts</small></div>
        </div>
        {this.details(match.teamHomeId, teams, seasonInfo, modelKey, true)}
        {this.details(match.teamAwayId, teams, seasonInfo, modelKey, false)}
    </div>
  }
}
