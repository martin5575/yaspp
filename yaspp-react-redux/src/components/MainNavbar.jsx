import * as React from 'react'
import { Component } from 'react'
import {
  dispatchSelectYear,
  updateMatchDaysIfNecessary,
} from '../actions/ActionBuilderWithStore'
import ListNavigator from './ListNavigator'
import { getSelectedYears } from '../utils/filter'
import {
  getSelectedLeague,
  getSelectedYear,
} from '../reducers/selectors/uiSelector'
import MainMenu from './MainMenu'
import { Navbar, NavbarBrand } from 'reactstrap'

class MainNavbar extends Component {
  update() {
    this.forceUpdate()
  }

  UNSAFE_componentWillMount () {
    this.unsubscribe = this.props.store.subscribe(this.update.bind(this))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  async yearChange(id) {
    const store = this.props.store
    let state = store.getState()
    const year = parseInt(id, 10)
    const selectedLeague = getSelectedLeague(state)
    dispatchSelectYear(store, selectedLeague, year)
    updateMatchDaysIfNecessary(store)
  }

  render() {
    const store = this.props.store
    const state = store.getState()
    const relevantYears = getSelectedYears(state)
    const selectedLeague = getSelectedLeague(state)
    const selectedYear = getSelectedYear(state)
    return (
      <Navbar >
      {/* <nav className="navbar navbar-expand-lg navbar-light bg-light"> */}
        {/* <div className='container-fluid'> */}
        <NavbarBrand href="/">{selectedLeague}</NavbarBrand>
        <ListNavigator
          buttonStyles={'btn-sm btn-light'}
          bgStyles={'btn-light'}
          selected={selectedYear}
          data={relevantYears}
          onSelect={this.yearChange.bind(this)}
        />
        <MainMenu store={store}></MainMenu>
        {/* </div> */}
      </Navbar>
    )
  }
}
export default MainNavbar
