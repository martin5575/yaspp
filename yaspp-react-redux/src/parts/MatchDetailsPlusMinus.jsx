import React from 'react'
import './MatchDetailsPlusMinus.css'
import { calcResultProbs } from '../maths/probabilities'
import _ from 'lodash'

export function MatchDetailsPlusMinus(props) {
  const hg = props.stats.home
  const ag = props.stats.away
  const probs = calcResultProbs(hg, ag, 7, 0.01)
  const numberOfGoals = [0, 1, 2, 3, 4, 5, 6]

  const plusMinusList = {}
  const maxPerDiff = {}
  numberOfGoals.forEach(x => {
    numberOfGoals.forEach(y => {
      const diff = x - y
      if (plusMinusList[diff] === undefined) plusMinusList[diff] = []
      plusMinusList[diff].push(probs[x][y])
      if (!maxPerDiff[diff] || probs[x][y] > maxPerDiff[diff].prob) {
        maxPerDiff[diff] = { prob: probs[x][y], result: `${x}:${y}` }
      }
    })
  })
  const range = Object.keys(plusMinusList)
    .map(x => parseInt(x))
    .sort((a, b) => a - b)
  const plusMinus = range.map(x => ({
    diff: x,
    prob: _.sum(plusMinusList[x]),
    maxResult: maxPerDiff[x].result,
    maxProb: maxPerDiff[x].prob,
  }))

  const rows = plusMinus.filter(x => x.prob > 0.01)
  const maxProbRow = Math.max(...rows.map(x => x.prob), 0.0001)

  const pct = v => `${(v * 100).toFixed(1)}%`
  const barW = v => `${Math.min(100, (v / maxProbRow) * 100).toFixed(1)}%`
  const badgeClass = d => (d > 0 ? 'pos' : d < 0 ? 'neg' : 'zero')

  return (
    <div className='plusminus-card'>
      <div className='pm-header'>
        <div className='pm-col pm-col-diff'>+/-</div>
        <div className='pm-col pm-col-prob'>Wahrscheinlichkeit</div>
        <div className='pm-col pm-col-top'>Top-Ergebnis</div>
      </div>
      <div className='pm-body'>
        {rows.map(row => (
          <div className='pm-row' key={`pm-${row.diff}`}>
            <div className={`pm-diff ${badgeClass(row.diff)}`}>{row.diff}</div>
            <div className='pm-bar' role='progressbar' aria-valuenow={(row.prob*100).toFixed(1)} aria-valuemin={0} aria-valuemax={100}>
              <div className='pm-fill' style={{ width: barW(row.prob) }} />
              <div className='pm-pct'>{pct(row.prob)}</div>
            </div>
            <div className='pm-top'>
              <span className='pm-top-res'>{row.maxResult}</span>
              <span className='pm-top-pct'>({pct(row.maxProb)})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}