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

export class MatchDetailsTop3 extends React.Component {
  render() {
    const hg = this.props.stats.home
    const ag = this.props.stats.away
    const probs = calcResultProbs(hg, ag, 7, 0.01)
    const numberOfGoals = [0,1,2,3,4,5,6]
    const probsList = []
    numberOfGoals.forEach(x=>{
      numberOfGoals.forEach(y=> {
        probsList.push(({prob:probs[x][y], result:`${x}:${y}`}))
      })
    })
    const sortedProbs = _.sortBy(probsList, x=>-x.prob); 
    return (<div className='row'>
      <div className='col-2 p-0'>
      <small><b>TOP 3</b></small>
      </div>
      {[0,1,2].map(x=> (
      <div className='col-3'>
      <small><b>{sortedProbs[x].result}</b> ({(sortedProbs[x].prob*100).toFixed(1)}%)</small>
      </div>
      ))}
    </div>
    ) 
  }
}