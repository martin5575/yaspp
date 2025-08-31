import React from 'react'
import './MatchDetailsTop3.css'
import { formatStats, calcStats } from '../stats/seasonInfo'
import {
  formatRate,
  formatPercentage,
  calcResultProbs,
} from '../maths/probabilities'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Card,CardBody, CardTitle } from 'reactstrap'
import _ from 'lodash'

const formatProbOrRate = (showPercentage, value) =>
  showPercentage ? formatPercentage(value) : formatRate(value)

export function MatchDetailsTop3(props) {
  const hg = props.stats.home
  const ag = props.stats.away
    const probs = calcResultProbs(hg, ag, 7, 0.01)
    const numberOfGoals = [0,1,2,3,4,5,6]
    const probsList = []
    numberOfGoals.forEach(x=>{
      numberOfGoals.forEach(y=> {
        probsList.push(({prob:probs[x][y], result:`${x}:${y}`}))
      })
    })
    const sortedProbs = _.sortBy(probsList, x=>-x.prob); 
  const maxProb = Math.max(...sortedProbs.slice(0,3).map(p=>p.prob), 1)
  return (
    <div className="prob-card">
      <div className='prob-header'>Top 3</div>
      <div className='prob-list'>
        {sortedProbs.slice(0,3).map((p, idx) => (
          <div className='prob-item' key={`top-prob-${idx}`} title={`Wahrscheinlichkeit für ${p.result}: ${(p.prob*100).toFixed(1)}%`}>
            <span className='prob-rank'>{idx + 1}</span>
            <span className='prob-result'>{p.result}</span>
            <span className='prob-val'>{(p.prob*100).toFixed(1)}%</span>
            <div className='prob-bar'>
              <div className='prob-bar-fill' style={{ width: `${(100 * p.prob) / maxProb}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className='prob-note'>Wahrscheinlichkeit</div>
    </div>
  ) 
}