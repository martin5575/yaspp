import * as React from 'react'
import { Component } from 'react'

class Header extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <header>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 text-center">
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
