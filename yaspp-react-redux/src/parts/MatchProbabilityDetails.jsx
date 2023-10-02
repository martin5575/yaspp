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
    const probs = calcResultProbs(hg, ag, 6, 0.01)
     return (
            <div className='container-fluid'>
                {[0,1,2,3,4,5].map((i) => (
                    <div className='row'>
                        {[0,1,2,3,4,5].map((j) => (
                        <div className='col-2 p-2 text-center score-card' style={{backgroundColor: `hsl(360 100% ${100 - (probs[i][j]*70.0)}%)`}}>
                            <p className='mb-0'>{i}:{j}</p>
                            <p><small>{formatProbOrRate(true, probs[i][j])}</small></p>
                        </div>
                        ))}
                    </div>
                ))}
            </div>
     )    
  }
}