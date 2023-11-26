import React from 'react'
import './MatchDetailsStats.css'




function MatchDetailsStats(props) {
    const logoSize = 35
    
    const teamCard=(team, seasonInfo, modelKey, isHomeTeam) =>{
    const info = seasonInfo.find(x=>x.team===team.id)
    const rank = seasonInfo.findIndex(x=>x.team===team.id)+1
    const total = ["tg_vs_tg", "tgdf_vs_tgdf"].includes(modelKey)
    const home = ["hg_vs_ag", "hgdf_vs_agdf"].includes(modelKey) && isHomeTeam
    const away = ["hg_vs_ag", "hgdf_vs_agdf"].includes(modelKey) && !isHomeTeam
    console.log(modelKey, total, home, away)

    return <div className='d-flex flex-column p-4'>
        <div className='d-flex justify-content-between'>
        <div className='p-0'>
            <img src={team.iconUrl} alt={team.name} 
                        height={logoSize}
                        width={logoSize}/>
        </div>
        {/* <div className='p-2 pb-0' style={{lineHeight: logoSize+"px", fontSize: logoSize*0.25+"px" }} >{team.shortName}</div> */}
        <div className='p-2 pb-0' style={{lineHeight: logoSize*0.6+"px", fontSize: logoSize*0.6+"px" }} >{rank}.</div>
        </div>
        <div className={'d-flex flex-column' + (total ? " bold":"")}>
            <div className='text-center align-middle' style={{lineHeight: logoSize*0.3+"px", fontSize: logoSize*0.25+"px" }}>GESAMT</div>
            <div className='d-flex  justify-content-between'>
                <div className='d-flex flex-column p-2 pt-0'>
                    <div className='flex-grow-1 text-center' style={{fontSize: logoSize*0.5+"px" }}>{info?.tp ?? 0}</div>
                    <div className='text-center' style={{fontSize: logoSize*0.2+"px" }}>P</div>
                </div>
                <div className='d-flex flex-column p-2 pt-0'>
                    <div className='flex-grow-1 text-center' style={{fontSize: logoSize*0.5+"px" }}>{info?.tgf ?? 0}</div>
                    <div className='text-center' style={{fontSize: logoSize*0.2+"px" }}>T</div>
                </div>
                <div className='d-flex flex-column p-2 pt-0'>
                    <div className='flex-grow-1 text-center' style={{fontSize: logoSize*0.5+"px" }}>{info?.tga ?? 0}</div>
                    <div className='text-center' style={{fontSize: logoSize*0.2+"px" }}>GT</div>
                </div>
            </div>
        </div>
        <div className={'d-flex flex-column' + (home ? " bold":"")}>
            <div className='text-center align-middle' style={{lineHeight: logoSize*0.3+"px", fontSize: logoSize*0.25+"px" }}>HEIM</div>
            <div className='d-flex  justify-content-between'>
                <div className='d-flex flex-column p-2 pt-0'>
                    <div className='flex-grow-1 text-center' style={{fontSize: logoSize*0.5+"px" }}>{info?.hp ?? 0}</div>
                    <div className='text-center' style={{fontSize: logoSize*0.2+"px" }}>P</div>
                </div>
                <div className='d-flex flex-column p-2 pt-0'>
                    <div className='flex-grow-1 text-center' style={{fontSize: logoSize*0.5+"px" }}>{info?.hgf ?? 0}</div>
                    <div className='text-center' style={{fontSize: logoSize*0.2+"px" }}>T</div>
                </div>
                <div className='d-flex flex-column p-2 pt-0'>
                    <div className='flex-grow-1 text-center' style={{fontSize: logoSize*0.5+"px" }}>{info?.hga ?? 0}</div>
                    <div className='text-center' style={{fontSize: logoSize*0.2+"px" }}>GT</div>
                </div>
            </div>
        </div>
        <div className={'d-flex flex-column' + (away ? " bold":"")}>
            <div className='text-center align-middle' style={{lineHeight: logoSize*0.3+"px", fontSize: logoSize*0.25+"px" }}>AUSWÄRTS</div>
            <div className='d-flex  justify-content-between'>
                <div className='d-flex flex-column p-2 pt-0'>
                    <div className='flex-grow-1 text-center' style={{fontSize: logoSize*0.5+"px" }}>{info?.ap ?? 0}</div>
                    <div className='text-center' style={{fontSize: logoSize*0.2+"px" }}>P</div>
                </div>
                <div className='d-flex flex-column p-2 pt-0'>
                    <div className='flex-grow-1 text-center' style={{fontSize: logoSize*0.5+"px" }}>{info?.agf ?? 0}</div>
                    <div className='text-center' style={{fontSize: logoSize*0.2+"px" }}>T</div>
                </div>
                <div className='d-flex flex-column p-2 pt-0'>
                    <div className='flex-grow-1 text-center' style={{fontSize: logoSize*0.5+"px" }}>{info?.aga ?? 0}</div>
                    <div className='text-center' style={{fontSize: logoSize*0.2+"px" }}>GT</div>
                </div>
            </div>
        </div>
    </div> 
    }

    const teams = props.teams;
    const match = props.match;
    const seasonInfo = props.seasonInfo;
    const modelKey = props.modelKey;
    if (!teams || !match || !seasonInfo) return <div>empty</div>
    console.log(modelKey)

    const teamHome = teams[match.teamHomeId]
    const teamAway = teams[match.teamAwayId]
    
    return <div className='d-flex justify-content-around'>
            {teamCard(teamHome, seasonInfo, modelKey, true)}
            {teamCard(teamAway, seasonInfo, modelKey, false)}
        </div>


  }

export default MatchDetailsStats
