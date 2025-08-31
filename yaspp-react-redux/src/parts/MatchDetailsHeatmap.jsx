import React from 'react'
import './MatchDetailsHeatmap.css'
import { calcResultProbs } from '../maths/probabilities'

export function MatchDetailsHeatmap(props) {
  const hg = props.stats.home
  const ag = props.stats.away
  const probs = calcResultProbs(hg, ag, 7, 0.01)
  const numberOfGoals = [0,1,2,3,4,5,6]

  const flat = numberOfGoals.flatMap(i => numberOfGoals.map(j => probs[i][j]))
  const maxP = Math.max(...flat, 0.0001)
  const pct = (v) => `${(v*100).toFixed(0)}%`
  const cellBg = (p) => {
    // Blue scale: light (low p) -> darker (high p)
    const light = 96, dark = 40
    const L = light - (p / maxP) * (light - dark)
    return `hsl(210 80% ${L}%)`
  }
  const lightness = (p) => {
    const light = 96, dark = 40
    return light - (p / maxP) * (light - dark)
  }

  return (
    <div className='heatmap-card'>
      <div className='hm-title'>Ergebnis-Wahrscheinlichkeiten</div>
      <div className='hm-grid' role='grid' aria-label='Wahrscheinlichkeiten'>
        <div className='hm-cell hm-corner' />
        {numberOfGoals.map(i => (
          <div key={`col-${i}`} className='hm-cell hm-colhdr'>{i}</div>
        ))}
        {numberOfGoals.map(i => (
          <React.Fragment key={`row-${i}`}>
            <div className='hm-cell hm-rowhdr'>{i}</div>
            {numberOfGoals.map(j => {
              const p = probs[i][j]
              const L = lightness(p)
              const isDark = L < 60
        return (
                <div
                  key={`cell-${i}-${j}`}
          className={`hm-cell hm-data ${i===j ? 'diag' : ''} ${isDark ? 'darkbg' : 'lightbg'}`}
                  style={{ backgroundColor: cellBg(p) }}
                  role='gridcell'
                  aria-label={`${i}:${j} — ${pct(p)}`}
                  title={`${i}:${j} — ${pct(p)}`}
                >
                  <span className={`hm-pct ${isDark ? 'dark' : 'light'}`}>{pct(p)}</span>
                </div>
              )
            })}
          </React.Fragment>
        ))}
      </div>
      <div className='hm-legend'>
        <div className='hm-legend-bar' />
        <div className='hm-legend-labels'>
          <span>0%</span>
          <span>höchste</span>
        </div>
      </div>
    </div>
  )
}