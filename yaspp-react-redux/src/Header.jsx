import * as React from 'react'
import { Component } from 'react'
import logo from './img/Sports_and_games.svg'

class Header extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const logoWidth = 120 //705
    const logoHeight = 655 * (logoWidth / 705)
    return (
      <header>
        <h1>
          {' '}
          <img src={logo} alt="logo" height={logoHeight} width={logoWidth} />Yet
          Another Sports Page
        </h1>
        <hr />
      </header>
    )
  }
}
export default Header
