import React from 'react'
import './MatchDetailsPlusMinus.css'
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

export function MatchDetailsPlusMinus(props) {
  const hg = props.stats.home
  const ag = props.stats.away
    const probs = calcResultProbs(hg, ag, 7, 0.01)
    const numberOfGoals = [0,1,2,3,4,5,6]

    const plusMinusList = {}
    const max = {}
    numberOfGoals.forEach(x=>{
      numberOfGoals.forEach(y=> {
        const diff = x-y
        if (plusMinusList[diff] === undefined) {
          plusMinusList[diff] = []
        }
        plusMinusList[diff].push(probs[x][y])
        if (max[diff] === undefined) {
          max[diff] = {prob:probs[x][y], result:`${x}:${y}`}
        } else if (probs[x][y] > max[diff].prob) {
          max[diff] = {prob:probs[x][y], result:`${x}:${y}`}
        }
      })
    })
    const range = Object.keys(plusMinusList).map(x=>parseInt(x)).sort((a,b)=>a-b)
    const plusMinus = range.map(x=> ({diff:x, prob:_.sum(plusMinusList[x]), maxResult:max[x].result, maxProb:max[x].prob}))
    
  return (<>
      <div className='row'>
        <div className='col-2 text-center'><small><b>+/-</b></small></div>
        <div className='col-5 text-right'><small><b>Wahrscheinlichkeit</b></small></div>
        <div className='col-5 text-right'><small><b>Top-Ergebnis</b></small></div>
      </div>
      {plusMinus.filter(x=>x.prob>0.01).map(x=> (<div className='row' 
          style={{backgroundColor: `hsl(360 100% ${100 - (x.prob*70.0)}%)`}}
          key={"plusminus-"+x.diff}
          >
        <div className='col-2 text-center'><small>{x.diff}</small></div>
        <div className='col-5 text-right'><small>{(x.prob*100).toFixed(1)}%</small></div>
        <div className='col-2 text-right'><small>{x.maxResult}</small></div>
        <div className='col-2 text-right p-0'><small>({(x.maxProb*100).toFixed(1)}%)</small></div>
      </div>))}
    </>)
}