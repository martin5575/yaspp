import { useState } from 'react';
import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap'
import { calcStats } from '../stats/seasonInfo';
import { MatchDetails2 } from './MatchDetails2';
import { IconButton } from '../components/IconButton';

const logoSize = 40

function MatchDayViewSettings(props) {
  const [visible, setVisible] = useState(false)
  const [matchNo, setMatchNo] = useState(0)

  
  console.log(props)
  const seasonInfo = props.seasonInfo;
  const modelKey = props.modelKey;
  const matchs = props.relevantMatchs;

  if (!matchs || matchs.length===0) return (<div>empty</div>) 


  const match = matchs[0];
  const teamHomeId = match.teamHomeId;
  const teamAwayId = match.teamAwayId;
  const stats = calcStats(seasonInfo, teamHomeId, teamAwayId, modelKey )

  const state = props.store.getState()
  console.log(state)
  const selectedLeague = state.ui.selectedLeague;
  const selectedYear = state.ui.selectedYear;
  const selectedMatchDay = state.ui.selectedMatchDay;

  const teams = props.teams;
  const league = state.model.leagues.find(x=>x.id===selectedLeague);
  const matchDay = state.model.matchDays.find(x=>x.id===selectedMatchDay && x.year===selectedYear && x.league===selectedLeague );

  console.log(league)
  console.log(teams)
  console.log(matchDay)
  console.log(matchs)

  const getTeamHome = (m) => m>=0 ? teams[matchs[m]?.teamHomeId] : { shortName: "HOME"}
  const getTeamAway = (m) => m>=0 ? teams[matchs[m]?.teamAwayId] : { shortName: "AWAY"}

  return (<div>
      <Button
      className="btn btn-secondary"
      onClick={() => setVisible(!visible)}
    >
      <FontAwesomeIcon icon="ellipsis-v" />
    </Button>
    <Offcanvas fade isOpen={visible} toggle={() => setVisible(!visible)} direction='top' backdrop={false} style={{'height': "100%"}}>
      <OffcanvasHeader toggle={() => setVisible(!visible)}>
      {matchDay.name} {selectedYear} {league.name}
      </OffcanvasHeader>
      <OffcanvasBody>
        <div className="d-flex justify-content-between align-middle mt-2 mb-3">
        <IconButton icon="caret-left" style={{'height': logoSize+"px", 'width': logoSize+"px"}}
          handleClick={()=>setMatchNo(matchNo<=0 ? matchs.length-1 : 0 + matchNo-1)} />  
          <span>{ getTeamHome(matchNo).shortName.substring(0,3).toUpperCase()}</span>
        
        <img src={getTeamHome(matchNo).iconUrl} alt={getTeamHome(matchNo).name} 
                        height={logoSize}
                        width={logoSize}/>
        <img src={getTeamAway(matchNo).iconUrl} alt={getTeamAway(matchNo).name} 
                        height={logoSize}
                        width={logoSize}/>
        <span>{ getTeamAway(matchNo).shortName.substring(0,3).toUpperCase()}</span>
        <IconButton icon="caret-right" handleClick={()=>setMatchNo((matchNo+1)%matchs.length)} />
        </div>
        <MatchDetails2 className="p-1 mt-2" match={matchs[matchNo]} teams={teams} seasonInfo={seasonInfo} modelKey={modelKey} stats={stats}/>
      </OffcanvasBody>
    </Offcanvas>
  </div>
  );
}

export default MatchDayViewSettings
