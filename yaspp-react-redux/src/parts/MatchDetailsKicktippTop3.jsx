import React from 'react'
import './MatchDetailsKicktippTop3.css'
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

  function getPointsForTip(observedHg, observedAg, tippedHg, tippedAg) {
    if (observedHg === tippedHg && observedAg === tippedAg) {
      return 4
    }
    if (observedHg === observedAg && tippedHg === tippedAg) {
      return 2
    }
    if (observedHg - observedAg === tippedHg - tippedAg) {
      return 3
    }
    if (
      (observedHg > observedAg && tippedHg > tippedAg) ||
      (observedHg < observedAg && tippedHg < tippedAg)
    ) {
      return 2
    }
    return 0
  }

  
  function calcExpectedPointsForResult(hg, ag, probs, numberOfGoals) {
    let expectedValue = 0;
    numberOfGoals.forEach(x=>{
      numberOfGoals.forEach(y=> {
        const pointForTip = getPointsForTip(x,y, hg, ag)
        expectedValue += probs[x][y] * pointForTip
      })
    });
    return expectedValue;
  }
  function calcExpectedPointsForAllResults(probs, numberOfGoals) {
    const count = numberOfGoals.length
    const expectedGoalsForResult = [];
    numberOfGoals.forEach(x=>{
      expectedGoalsForResult[x]=[];
      numberOfGoals.forEach(y=> {
        expectedGoalsForResult[x][y]= calcExpectedPointsForResult(x,y, probs, numberOfGoals)
      })
    });
    return expectedGoalsForResult;
  }


export class MatchDetailsKicktippTop3 extends React.Component {




  render() {
    const hg = this.props.stats.home
    const ag = this.props.stats.away
    const probs = calcResultProbs(hg, ag, 7, 0.01)
    const numberOfGoals = [0,1,2,3,4,5,6]
    const expectedPoints = calcExpectedPointsForAllResults(probs, numberOfGoals)

    const expectedPointsList = []
    numberOfGoals.forEach(x=>{
      numberOfGoals.forEach(y=> {
        expectedPointsList.push(({expectedPoints: expectedPoints[x][y], result:`${x}:${y}`}))
      })
    })
    const sortedExpectedPoints = _.sortBy(expectedPointsList, x=>-x.expectedPoints); 
    return (<div className="flex-column">
    <div className='text-center'><small><b>TIPP 3</b></small></div>
    {[0,1,2].map(x=> (
    <div className='text-center' key={"kickTippTop-"+x}>
    <small><b>{sortedExpectedPoints[x].result}</b> ({sortedExpectedPoints[x].expectedPoints.toFixed(2)})</small>
    </div>
    ))}
  </div>
    ) 


  }
}