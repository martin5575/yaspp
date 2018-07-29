import * as React from 'react'
import { Component } from 'react'

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
        <div className="float-right">
          <i style={divStyle}>
            Data provided by <a href="https://www.openligadb.de">Openliga DB</a>{' '}
          </i>
        </div>
      </footer>
    )
  }
}
export default Footer
