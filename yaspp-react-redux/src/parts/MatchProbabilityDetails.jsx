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

const formatProbOrRate = (showPercentage, value) =>
  showPercentage ? formatPercentage(value) : formatRate(value)

export class MatchProbabilityDetails extends React.Component {
  
  render() {
    const hg = this.props.stats.home
    const ag = this.props.stats.away
    const probs = calcResultProbs(hg, ag, 7, 0.01)
    const numberOfGoals = [0,1,2,3,4,5,6]
    const formatProb = (prob) => { return (prob*100).toFixed(0)};
     return (
            <div className='d-flex flex-column p-0'>
                <div className='d-flex flex-nowrap align-items-stretch'>
                  <div className='p-2 text-center score-card'>[%]</div>
                  {numberOfGoals.map((i) => (<div className='p-2 text-center score-card'>{i}</div>))}
                </div>
                {numberOfGoals.map((i) => (
                    <div className='d-flex flex-nowrap align-items-stretch'>
                        <div className='p-2 text-center score-card'>{i}</div>
                        {numberOfGoals.map((j) => (
                        <div className={`p-2 text-center score-card ${i===j?"diagonal":""}`} style={{backgroundColor: `hsl(360 100% ${100 - (probs[i][j]*70.0)}%)`}}>
                            <small>{formatProb(probs[i][j])}</small>
                        </div>
                        ))}
                    </div>
                ))}
            </div>
     )    
  }
}