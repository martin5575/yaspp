import { useState } from 'react';
import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Badge, Button, Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap'
import { calcStats } from '../stats/seasonInfo';
import { MatchDetails2 } from './MatchDetails2';
import { IconButton } from '../components/IconButton';
import { MatchDayOptionsButton } from './MatchDayOptionsButton';
import { ButtonGroup, ButtonToolbar } from 'reactstrap';
import { PercentageButton } from '../components/PercentageButton';
import  MatchdayNavigator  from '../components/MatchdayNavigator';

const logoSize = 40

function MatchDayViewSettings(props) {
  const [visible, setVisible] = useState(false)
  const [matchNo, setMatchNo] = useState(0)

  
  const matchs = props.relevantMatchs;
  if (!matchs || matchs.length===0) return (<div>empty</div>) 

  const seasonInfo = props.seasonInfo;
  const teams = props.teams;
  const modelKey = props.modelKey;
  const store = props.store;
  const state = store.getState()
  const selectedLeague = state.ui.selectedLeague;
  const selectedYear = state.ui.selectedYear;
  const selectedMatchDay = state.ui.selectedMatchDay;
  

  const league = state.model.leagues.find(x=>x.id===selectedLeague);
  const matchDay = state.model.matchDays.find(x=>x.id===selectedMatchDay && x.year===selectedYear && x.league===selectedLeague );

  const match = matchs[matchNo];
  const teamHomeId = match.teamHomeId;
  const teamHome = teams[teamHomeId]
  const teamAwayId = match.teamAwayId;
  const teamAway = teams[teamAwayId]
  const stats = calcStats(seasonInfo, teamHomeId, teamAwayId, modelKey )

  return (<div>
      <Button
      className="btn btn-secondary"
      onClick={() => setVisible(!visible)}
    >
      <FontAwesomeIcon icon="ellipsis-v" />
    </Button>
    <Offcanvas fade isOpen={visible} toggle={() => setVisible(!visible)} direction='top' backdrop={false} style={{'height': "100%"}}>
      <OffcanvasHeader toggle={() => setVisible(!visible)}>
        {league.name} {selectedYear}
      </OffcanvasHeader>
      <OffcanvasBody>
        <ButtonToolbar>
          <ButtonGroup>
            <MatchDayOptionsButton selectedModelId={state.ui.selectedModelId} />
          </ButtonGroup>
          <MatchdayNavigator store={store} />
            <ButtonGroup>
              <PercentageButton
                  state={state}
                  onClick={(s) =>
                    this.props.store.dispatch(
                      actionBuilder.showPercentage(!s.ui.showPercentage)
                    )
                  }
                />
            </ButtonGroup>
        </ButtonToolbar>
        <div className="text-center mb-3">
          
        </div>
        <div className="d-flex justify-content-between align-middle mt-2 mb-3">
        <IconButton icon="caret-left" style={{'height': logoSize+"px", 'width': logoSize+"px"}}
          handleClick={()=>setMatchNo(matchNo<=0 ? matchs.length-1 : 0 + matchNo-1)} />  
          <span style={{lineHeight: logoSize+"px"}} >{ teamHome.shortName.substring(0,3).toUpperCase()}</span>
        
        <img src={teamHome.iconUrl} alt={teamHome.name} 
                        height={logoSize}
                        width={logoSize}/>
        <img src={teamAway.iconUrl} alt={teamAway.name} 
                        height={logoSize}
                        width={logoSize}/>
        <span style={{lineHeight: logoSize+"px"}}>{ teamAway.shortName.substring(0,3).toUpperCase()}</span>
        <IconButton icon="caret-right" handleClick={()=>setMatchNo((matchNo+1)%matchs.length)} />
        </div>
        <MatchDetails2 className="p-1 mt-2" match={matchs[matchNo]} teams={teams} seasonInfo={seasonInfo} modelKey={modelKey} stats={stats}/>
      </OffcanvasBody>
    </Offcanvas>
  </div>
  );
}

export default MatchDayViewSettings
