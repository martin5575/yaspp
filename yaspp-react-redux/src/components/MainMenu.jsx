import React, { useState } from 'react';
import { Collapse, Button, CardBody, Card, Nav, NavbarToggler, NavbarText, NavItem, NavLink } from 'reactstrap';
import {
    dispatchSelectLeague,
    dispatchFetchYears,
    updateMatchDaysIfNecessary,
    dispatchSwitchMenu,
  } from '../actions/ActionBuilderWithStore'
import { getAllLeagues } from '../reducers/selectors/modelSelector'
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
  


function MainMenu(props) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    const next = !isOpen
    setIsOpen(next)
    if (typeof props.onOpenChange === 'function') props.onOpenChange(next)
  }

  function selectMenu(event) {
    const store = props.store
    dispatchSwitchMenu(store, event.target.id)
  }

  function leagueChange(event) {
    const store = props.store
    dispatchSwitchMenu(store, 'matchs')
    dispatchSelectLeague(store, event.target.id)
    dispatchFetchYears(store, event.target.id)

    updateMatchDaysIfNecessary(store)
  }

  const store = props.store
  let state = store.getState()
  const selectedLeague = state.ui.selectedLeague;
  const leagues = getAllLeagues(state)

  return (
    <React.StrictMode>
      <NavbarToggler className='me-2' onClick={toggle} />
      <Collapse isOpen={isOpen}>
        <div className='vw-100'>
        <Nav navbar vertical="sm" fill={false}>
            <NavbarText>
                <FontAwesomeIcon icon="futbol" />
                &nbsp;
                <b>Fußball</b>
            </NavbarText>
            {leagues.map((l) => (
            <NavItem active={l.id === selectedLeague} key={l.id}>
                <NavLink href="#" id={l.id} onClick={leagueChange}>
                  {l.name}
                </NavLink>
            </NavItem>))}
            <NavbarText>
                <b>Einstellungen</b>
            </NavbarText>
            <NavItem>
                <NavLink href="#" id="storage" onClick={selectMenu}>
                  Speicher
                </NavLink>
          </NavItem>  
        </Nav>
        </div>
      </Collapse>
    </React.StrictMode>
  );
}

export default MainMenu;



