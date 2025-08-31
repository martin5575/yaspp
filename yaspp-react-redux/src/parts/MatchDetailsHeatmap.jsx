import React from 'react'
import './MatchDetailsHeatmap.css'
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

export function MatchDetailsHeatmap(props) {
  const hg = props.stats.home
  const ag = props.stats.away
    const probs = calcResultProbs(hg, ag, 7, 0.01)
    const numberOfGoals = [0,1,2,3,4,5,6]

    const formatProb = (prob) => { return (prob*100).toFixed(0)};
  return (
    <div className='row'>
    <div className='col-1'></div>
    <div className='col-10'>
    <div className='d-flex flex-column p-0'>
        <div className='d-flex flex-nowrap align-items-stretch'>
          <div className='p-2 text-center score-card'><small><b>[%]</b></small></div>
          {numberOfGoals.map((i) => (<div className='p-2 text-center score-card' key={"heatmap-col-"+i}><small><b>{i}</b></small></div>))}
        </div>
        {numberOfGoals.map((i) => (
            <div className='d-flex flex-nowrap align-items-stretch' key={"heatmap-row-"+i}>
                <div className='p-2 text-center score-card'><small><b>{i}</b></small></div>
                {numberOfGoals.map((j) => (
                <div className={`p-2 text-center score-card ${i===j?"diagonal":"non-diagonal"}`} 
                    style={{backgroundColor: `hsl(360 100% ${100 - (probs[i][j]*70.0)}%)`}}
                    key={`heatmap-cell-${i}-${j}`}>
                    <small>{formatProb(probs[i][j])}</small>
                </div>
                ))}
            </div>
        ))}
    </div>
    </div>
  </div>)
}