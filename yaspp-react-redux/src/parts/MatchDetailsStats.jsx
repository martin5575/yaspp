import React from 'react'
import './MatchDetailsStats.css'
import { getKey } from '../stats/statsType'

function MatchDetailsStats(props) {
    const teamCard = (team, info, rank, highlights, maxima) => {
        const bar = (val, max) => {
            const v = Math.max(0, Number(val) || 0)
            const m = Math.max(1, Number(max) || 1)
            return `${Math.min(100, (v / m) * 100)}%`
        }
        return (
            <div className='team-card'>
                <div className='team-head'>
                    <img src={team.iconUrl} alt={team.name} height={35} width={35} />
                    <span className='team-rank' title='Tabellenplatz'>{rank}.</span>
                </div>

                <div className={`stats-section ${highlights.total ? 'emph' : ''}`}>
                    <div className='stats-title'>GESAMT</div>
                    <div className='kpi-row'>
                        <div className='kpi'>
                            <div className='kpi-val'>{info?.tp ?? 0}</div>
                            <div className='kpi-label'>P</div>
                            <div className='kpi-bar'><div className='kpi-fill' style={{ width: bar(info?.tp, maxima.total.tp) }} /></div>
                        </div>
                        <div className='kpi'>
                            <div className='kpi-val'>{info?.tgf ?? 0}</div>
                            <div className='kpi-label'>T</div>
                            <div className='kpi-bar'><div className='kpi-fill' style={{ width: bar(info?.tgf, maxima.total.tgf) }} /></div>
                        </div>
                        <div className='kpi'>
                            <div className='kpi-val'>{info?.tga ?? 0}</div>
                            <div className='kpi-label'>GT</div>
                            <div className='kpi-bar'><div className='kpi-fill' style={{ width: bar(info?.tga, maxima.total.tga) }} /></div>
                        </div>
                    </div>
                </div>

                <div className={`stats-section ${highlights.home ? 'emph' : ''}`}>
                    <div className='stats-title'>HEIM</div>
                    <div className='kpi-row'>
                        <div className='kpi'>
                            <div className='kpi-val'>{info?.hp ?? 0}</div>
                            <div className='kpi-label'>P</div>
                            <div className='kpi-bar'><div className='kpi-fill' style={{ width: bar(info?.hp, maxima.home.hp) }} /></div>
                        </div>
                        <div className='kpi'>
                            <div className='kpi-val'>{info?.hgf ?? 0}</div>
                            <div className='kpi-label'>T</div>
                            <div className='kpi-bar'><div className='kpi-fill' style={{ width: bar(info?.hgf, maxima.home.hgf) }} /></div>
                        </div>
                        <div className='kpi'>
                            <div className='kpi-val'>{info?.hga ?? 0}</div>
                            <div className='kpi-label'>GT</div>
                            <div className='kpi-bar'><div className='kpi-fill' style={{ width: bar(info?.hga, maxima.home.hga) }} /></div>
                        </div>
                    </div>
                </div>

                <div className={`stats-section ${highlights.away ? 'emph' : ''}`}>
                    <div className='stats-title'>AUSWÄRTS</div>
                    <div className='kpi-row'>
                        <div className='kpi'>
                            <div className='kpi-val'>{info?.ap ?? 0}</div>
                            <div className='kpi-label'>P</div>
                            <div className='kpi-bar'><div className='kpi-fill' style={{ width: bar(info?.ap, maxima.away.ap) }} /></div>
                        </div>
                        <div className='kpi'>
                            <div className='kpi-val'>{info?.agf ?? 0}</div>
                            <div className='kpi-label'>T</div>
                            <div className='kpi-bar'><div className='kpi-fill' style={{ width: bar(info?.agf, maxima.away.agf) }} /></div>
                        </div>
                        <div className='kpi'>
                            <div className='kpi-val'>{info?.aga ?? 0}</div>
                            <div className='kpi-label'>GT</div>
                            <div className='kpi-bar'><div className='kpi-fill' style={{ width: bar(info?.aga, maxima.away.aga) }} /></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const { teams, match, seasonInfo, selectedModelId } = props
    const modelKey = getKey(selectedModelId)
    if (!teams || !match || !seasonInfo) return <div>empty</div>

    const teamHome = teams[match.teamHomeId]
    const teamAway = teams[match.teamAwayId]
    const infoHome = seasonInfo.find(x => x.team === teamHome.id) || {}
    const infoAway = seasonInfo.find(x => x.team === teamAway.id) || {}
    const rankHome = (seasonInfo.findIndex(x => x.team === teamHome.id) + 1) || 1
    const rankAway = (seasonInfo.findIndex(x => x.team === teamAway.id) + 1) || 1

    const maxima = {
        total: {
            tp: Math.max(infoHome.tp || 0, infoAway.tp || 0),
            tgf: Math.max(infoHome.tgf || 0, infoAway.tgf || 0),
            tga: Math.max(infoHome.tga || 0, infoAway.tga || 0),
        },
        home: {
            hp: Math.max(infoHome.hp || 0, infoAway.hp || 0),
            hgf: Math.max(infoHome.hgf || 0, infoAway.hgf || 0),
            hga: Math.max(infoHome.hga || 0, infoAway.hga || 0),
        },
        away: {
            ap: Math.max(infoHome.ap || 0, infoAway.ap || 0),
            agf: Math.max(infoHome.agf || 0, infoAway.agf || 0),
            aga: Math.max(infoHome.aga || 0, infoAway.aga || 0),
        },
    }

    const highlightsFor = (isHome) => ({
        total: ["tg_vs_tg", "tgdf_vs_tgdf"].includes(modelKey),
        home: ["hg_vs_ag", "hgdf_vs_agdf"].includes(modelKey) && isHome,
        away: ["hg_vs_ag", "hgdf_vs_agdf"].includes(modelKey) && !isHome,
    })

    return (
        <div className='match-stats-cards'>
            {teamCard(teamHome, infoHome, rankHome, highlightsFor(true), maxima)}
            {teamCard(teamAway, infoAway, rankAway, highlightsFor(false), maxima)}
        </div>
    )
}

export default MatchDetailsStats
