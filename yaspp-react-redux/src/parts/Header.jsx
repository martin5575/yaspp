import * as React from 'react'
import { Component } from 'react'
import Navbar from '../components/Navbar'
import './Header.css'

class Header extends Component {
  render() {
    return (
      <header>
        <p className="text-center font-italic">
          <span className="badge badge-dark">yaspp</span>
          &nbsp; yet another sports page
        </p>
        <Navbar store={this.props.store} />
      </header>
    )
  }
}
export default Header
