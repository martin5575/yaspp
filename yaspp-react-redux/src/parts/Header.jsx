import * as React from 'react'
import { Component } from 'react'
import MainNavbar from '../components/MainNavbar'
import './Header.css'
import { Badge } from 'reactstrap'

class Header extends Component {
  render() {
    return (
      <header>
        <p className="text-center font-italic">
          <Badge color="dark">yaspp</Badge>
          &nbsp; yet another sports page
        </p>
        <MainNavbar store={this.props.store} />
      </header>
    )
  }
}
export default Header
