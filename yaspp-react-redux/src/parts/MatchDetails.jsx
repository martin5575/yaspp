import React, { useState } from 'react';
import { MatchDetailsHeatmap } from './MatchDetailsHeatmap'
import { MatchDetailsTop3 } from './MatchDetailsTop3'
import { MatchDetailsKicktippTop3 } from './MatchDetailsKicktippTop3'
import { MatchDetailsPlusMinus } from './MatchDetailsPlusMinus'
import MatchDetailsStats from './MatchDetailsStats'
import { getKey, getShort, getDescription } from '../stats/statsType'
import './MatchDetails.css'

const logoSize = 20;

export function MatchDetails(props) {
    const teams = props.teams;
    const match = props.match;
    const seasonInfo = props.seasonInfo;
    const stats = props.stats;
    const selectedModelId = props.selectedModelId;
    if (!teams || !match || !seasonInfo) return <div>empty</div>

  const views = [
    { id: 'overview', label: 'Overview' },
    { id: 'plusminus', label: 'Plus/Minus' },
    { id: 'heatmap', label: 'Heatmap' },
  ]
  const [activeView, setActiveView] = useState('overview')

  const modelShortDescription = getShort(getKey(selectedModelId))

  const Overview = (
    <div className='md-overview'>
      <MatchDetailsStats teams={teams} match={match} seasonInfo={seasonInfo} selectedModelId={selectedModelId} />
      <div className='md-two-col'>
        <MatchDetailsTop3 stats={stats} />
        <MatchDetailsKicktippTop3 stats={stats} />
      </div>
      <div className='md-model-note'>
        Model: {modelShortDescription}
      </div>
    </div>
  )

  const PlusMinus = (
    <div className='row'><div className='col-1'></div>
      <div className='col-10'>
        <MatchDetailsPlusMinus stats={stats} />
      </div>
    </div>
  )

  const Heatmap = (
    <MatchDetailsHeatmap stats={stats} />
  )

  return (
    <>
      <div className='md-tabs-wrapper'>
        <div
          className='md-tabs'
          role='tablist'
          aria-label='Match details'
          onKeyDown={(e)=>{
            const idx = views.findIndex(v=>v.id===activeView)
            if (e.key==='ArrowLeft') {
              e.preventDefault();
              const next = (idx + views.length - 1) % views.length
              setActiveView(views[next].id)
            }
            if (e.key==='ArrowRight') {
              e.preventDefault();
              const next = (idx + 1) % views.length
              setActiveView(views[next].id)
            }
          }}
        >
          {views.map(v => (
            <button
              key={v.id}
              type='button'
              role='tab'
              aria-selected={activeView===v.id}
              className={`md-tab ${activeView===v.id ? 'active' : ''}`}
              onClick={()=>setActiveView(v.id)}
            >
              <span className='md-tab-label'>{v.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className='md-panel'>
        {activeView==='overview' && Overview}
        {activeView==='plusminus' && PlusMinus}
        {activeView==='heatmap' && Heatmap}
      </div>
      </>
  );
}

export default MatchDetails;