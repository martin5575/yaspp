import { calcResultProbs,
} from '../maths/probabilities'
import _ from 'lodash'


export function getPointsForTipp(observedHg, observedAg, tippedHg, tippedAg) {
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

  
export function calcExpectedPointsForResult(hg, ag, probs, numberOfGoals) {
    let expectedValue = 0;
    numberOfGoals.forEach(x=>{
      numberOfGoals.forEach(y=> {
        const pointForTip = getPointsForTipp(x,y, hg, ag)
        expectedValue += probs[x][y] * pointForTip
      })
    });
    return expectedValue;
  }

export function calcExpectedPointsForAllResults(hg, ag, numberOfGoals) {
    const probs = calcResultProbs(hg, ag, numberOfGoals.length, 0.01)
    const expectedGoalsForResult = [];
    numberOfGoals.forEach(x=>{
      expectedGoalsForResult[x]=[];
      numberOfGoals.forEach(y=> {
        expectedGoalsForResult[x][y]= calcExpectedPointsForResult(x,y, probs, numberOfGoals)
      })
    });
    return expectedGoalsForResult;
  }

export function getTopTippResults(hg, ag, numberOfGoals, numberOfResults) {
    const expectedPoints = calcExpectedPointsForAllResults(hg, ag, numberOfGoals)
    const expectedPointsList = []
    numberOfGoals.forEach(x=>{
      numberOfGoals.forEach(y=> {
        expectedPointsList.push(({expectedPoints: expectedPoints[x][y], result:`${x}:${y}`, fullTimeHome: x, fullTimeAway: y}))
      })
    })
    const sortedExpectedPoints = _.sortBy(expectedPointsList, x=>-x.expectedPoints); 
    return sortedExpectedPoints.slice(0, numberOfResults)
}

export function getTopTippResult(hg, ag, numberOfGoals) {
    const topTippResults = getTopTippResults(hg, ag, numberOfGoals, 1)
    return topTippResults[0]
}
