import * as React from 'react'
import { Component } from 'react'
import logo from './img/logo.png'

class Header extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const logoWidth = Math.min(window.innerWidth * 0.1, 100) //705
    const logoHeight = 655 * (logoWidth / 705)
    return (
      <header>
        <div className="container">
          <div className="row">
            <div className="col-xs-2 col-xs-1-push">
              <img
                src={logo}
                alt="logo"
                height={logoHeight}
                width={logoWidth}
              />
            </div>
            <div className="col-xs-8">
              <div style={{ fontSize: 'x-large' }}>Yet Another Sports Page</div>
            </div>
          </div>
        </div>
        <hr />
      </header>
    )
  }
}
export default Header
