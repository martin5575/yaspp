import React from 'react'
import './MatchDetailsKicktippTop3.css'
import {getTopTippResults} from '../kicktipp'

export function MatchDetailsKicktippTop3(props) {
  const hg = props.stats.home
  const ag = props.stats.away
    const numberOfGoals = [0,1,2,3,4,5,6]
    const topTippResults = getTopTippResults(hg, ag, numberOfGoals, 3)

return (<div className="flex-column">
    <div className='text-center'><small><b>TIPP 3</b></small></div>
    {[0,1,2].map(x=> (
    <div className='text-center' key={"kickTippTop-"+x}>
    <small><b>{topTippResults[x].result}</b> ({topTippResults[x].expectedPoints.toFixed(2)})</small>
    </div>
    ))}
  </div>
    ) 

}