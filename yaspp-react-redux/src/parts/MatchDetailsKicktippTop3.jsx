import React from 'react'
import './MatchDetailsKicktippTop3.css'
import { getTopTippResults } from '../kicktipp'

export function MatchDetailsKicktippTop3(props) {
  const { stats, className = '' } = props
  const hg = stats.home
  const ag = stats.away
  const numberOfGoals = [0, 1, 2, 3, 4, 5, 6]
  const topTippResults = getTopTippResults(hg, ag, numberOfGoals, 3)
  const maxExp = Math.max(...topTippResults.map(r => r.expectedPoints || 0), 1)

  return (
    <div className={`kicktipp-card ${className}`}>
      <div className='kicktipp-header'>Tipp 3</div>
      <div className='kicktipp-list'>
        {topTippResults.map((t, idx) => (
          <div className='kicktipp-item' key={`kickTippTop-${idx}`} title={`Erwartete Punkte für ${t.result}: ${t.expectedPoints.toFixed(2)}`}>
            <span className='kicktipp-rank'>{idx + 1}</span>
            <span className='kicktipp-result'>{t.result}</span>
            <span className='kicktipp-pts'>{t.expectedPoints.toFixed(2)}</span>
            <div className='kicktipp-bar'>
              <div className='kicktipp-bar-fill' style={{ width: `${(100 * (t.expectedPoints || 0)) / maxExp}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className='kicktipp-note'>Erwartete Punkte</div>
    </div>
  )
}