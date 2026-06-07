import React from 'react'
import { computeTeamFacts, computeLeagueRankings } from '../stats/matchFacts'
import './MatchDetailsFacts.css'

function TeamFactsColumn({ teamId, teams, previousMatchs, seasonInfo }) {
  const facts = computeTeamFacts(teamId, previousMatchs, seasonInfo)
  const team = teams[teamId]

  return (
    <div className='mdf-team-col'>
      <div className='mdf-team-header'>
        {team?.iconUrl && (
          <img src={team.iconUrl} alt='' className='mdf-team-logo' />
        )}
        <span className='mdf-team-name'>{team?.shortName || team?.name || teamId}</span>
      </div>
      {facts.length === 0 ? (
        <div className='mdf-no-facts'>Keine besonderen Serien</div>
      ) : (
        facts.map((f, i) => (
          <div key={i} className={`mdf-fact ${f.positive ? 'pos' : 'neg'}`}>
            <span className='mdf-dot' />
            <span>{f.text}</span>
          </div>
        ))
      )}
    </div>
  )
}

function MiniRankList({ title, items, teams, highlightIds }) {
  if (!items?.length) return null
  return (
    <div className='mdf-mini-list'>
      <div className='mdf-mini-title'>{title}</div>
      {items.map(item => {
        const t = teams[item.team]
        const hi = highlightIds.includes(item.team)
        return (
          <div key={item.team} className={`mdf-mini-row${hi ? ' hi' : ''}`}>
            <span className='mdf-mini-rank'>#{item.rank}</span>
            {t?.iconUrl && <img src={t.iconUrl} alt='' className='mdf-mini-logo' />}
            <span className='mdf-mini-name'>{t?.shortName || t?.name || item.team}</span>
            <span className='mdf-mini-val'>{item.val.toFixed(2)}</span>
          </div>
        )
      })}
    </div>
  )
}

export function MatchDetailsFacts({ teams, match, seasonInfo, previousMatchs }) {
  if (!teams || !match) return null

  const rankings = computeLeagueRankings(seasonInfo)
  const hiIds = [match.teamHomeId, match.teamAwayId]

  return (
    <div className='mdf-root'>
      <div className='mdf-team-grid'>
        <TeamFactsColumn
          teamId={match.teamHomeId}
          teams={teams}
          previousMatchs={previousMatchs}
          seasonInfo={seasonInfo}
        />
        <TeamFactsColumn
          teamId={match.teamAwayId}
          teams={teams}
          previousMatchs={previousMatchs}
          seasonInfo={seasonInfo}
        />
      </div>

      {rankings ? (
        <div className='mdf-rankings-section'>
          <div className='mdf-section-head'>Liga-Rankings (Saison)</div>
          <div className='mdf-rankings-grid'>
            <div>
              <MiniRankList
                title='⚡ Top Angriff'
                items={rankings.topAttack}
                teams={teams}
                highlightIds={hiIds}
              />
              <MiniRankList
                title='🔻 Schw. Angriff'
                items={rankings.botAttack}
                teams={teams}
                highlightIds={hiIds}
              />
            </div>
            <div>
              <MiniRankList
                title='🛡 Top Abwehr'
                items={rankings.topDefense}
                teams={teams}
                highlightIds={hiIds}
              />
              <MiniRankList
                title='💥 Schw. Abwehr'
                items={rankings.botDefense}
                teams={teams}
                highlightIds={hiIds}
              />
            </div>
          </div>
        </div>
      ) : (
        <p className='mdf-no-data'>Noch keine Saison-Daten für Rankings verfügbar.</p>
      )}
    </div>
  )
}

export default MatchDetailsFacts
