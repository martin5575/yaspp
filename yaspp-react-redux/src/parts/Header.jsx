import * as React from 'react'
import { Component } from 'react'
import Navbar from '../components/Navbar'

class Header extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <header>
        <p className="text-center">Yet Another Sports Page</p>
        <Navbar store={this.props.store} />
      </header>
    )
  }
}
export default Header
