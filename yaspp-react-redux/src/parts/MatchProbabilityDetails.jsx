import React from 'react'
import './MatchProbabilityDetails.css'
import { formatStats, calcStats } from '../stats/seasonInfo'
import {
  formatRate,
  formatPercentage,
  calcResultProbs,
} from '../maths/probabilities'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'reactstrap'
import _ from 'lodash'

const formatProbOrRate = (showPercentage, value) =>
  showPercentage ? formatPercentage(value) : formatRate(value)

export class MatchProbabilityDetails extends React.Component {
  
  renderTop3 = (probs, numberOfGoals) => {
    const probsList = []
    numberOfGoals.forEach(x=>{
      numberOfGoals.forEach(y=> {
        probsList.push(({prob:probs[x][y], result:`${x}:${y}`}))
      })
    })
    const sortedProbs = _.sortBy(probsList, x=>-x.prob); 
    return (<div className='row'>
      <div className='col-2'>
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

  renderPlusMinus = (probs, numberOfGoals) => {
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
        <div className='col-3 text-right'><small><b>Wahrscheinlichkeit</b></small></div>
        <div className='col-1'></div>
        <div className='col-4 text-right'><small><b>Top-Ergebnis</b></small></div>
      </div>
      {plusMinus.filter(x=>x.prob>0.01).map(x=> (<div className='row' style={{backgroundColor: `hsl(360 100% ${100 - (x.prob*70.0)}%)`}}>
        <div className='col-2 text-center'><small>{x.diff}</small></div>
        <div className='col-3 text-right'><small>{(x.prob*100).toFixed(1)}%</small></div>
        <div className='col-3 text-right'><small>{x.maxResult}</small></div>
        <div className='col-1 text-right'><small>({(x.maxProb*100).toFixed(1)}%)</small></div>
      </div>))}
    </>)
  }


  render() {
    const hg = this.props.stats.home
    const ag = this.props.stats.away
    const probs = calcResultProbs(hg, ag, 7, 0.01)
    const numberOfGoals = [0,1,2,3,4,5,6]
    const formatProb = (prob) => { return (prob*100).toFixed(0)};


     return (
      <>
          {this.renderTop3(probs, numberOfGoals)}
          <div className='row mt-3'> </div>
          {this.renderPlusMinus(probs, numberOfGoals)}
          <div className='row mt-3'>
            <div className='col-1'></div>
            <div className='col-9'>
            <div className='d-flex flex-column p-0'>
                <div className='d-flex flex-nowrap align-items-stretch'>
                  <div className='p-2 text-center score-card'><small><b>[%]</b></small></div>
                  {numberOfGoals.map((i) => (<div className='p-2 text-center score-card'><small><b>{i}</b></small></div>))}
                </div>
                {numberOfGoals.map((i) => (
                    <div className='d-flex flex-nowrap align-items-stretch'>
                        <div className='p-2 text-center score-card'><small><b>{i}</b></small></div>
                        {numberOfGoals.map((j) => (
                        <div className={`p-2 text-center score-card ${i===j?"diagonal":"non-diagonal"}`} style={{backgroundColor: `hsl(360 100% ${100 - (probs[i][j]*70.0)}%)`}}>
                            <small>{formatProb(probs[i][j])}</small>
                        </div>
                        ))}
                    </div>
                ))}
            </div>
            </div>
            </div>
            </>
     )    
  }
}