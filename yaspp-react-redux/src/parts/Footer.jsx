import * as React from 'react'
import { Component } from 'react'
import './Footer.css'

class Footer extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const divStyle = {
      margin: '20px',
    }
    return (
      <footer>
        <hr />
        <div className="text-right">
          <i style={divStyle}>
            Data provided by <a href="https://www.openligadb.de">Openliga DB</a>{' '}
          </i>
        </div>
      </footer>
    )
  }
}
export default Footer
