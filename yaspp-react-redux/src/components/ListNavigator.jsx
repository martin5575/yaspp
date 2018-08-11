import * as React from 'react'
import { Component } from 'react'

class ListNavigator extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    console.log(this.props)
    if (!this.props.data) return <div />
    const buttonStyles = 'btn-sm btn-light'
    const bgStyles = 'btn-light'
    return (
      <div
        className={`btn-group ${bgStyles}`}
        role="group"
        aria-label="Button group with nested dropdown"
      >
        <button type="button" className={`btn btn-secondary ${buttonStyles}`}>
          &lt;
        </button>
        <div className="btn-group" role="group">
          <button
            id="btnGroupDrop1"
            type="button"
            className={`btn btn-secondary dropdown-toggle ${buttonStyles}`}
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {this.props.selection}
          </button>
          <div className="dropdown-menu" aria-labelledby="btnGroupDrop1">
            {this.props.data.map((x) => (
              <a
                className="dropdown-item"
                href="#"
                id={x.id}
                key={x.id}
                onClick={this.props.onChange}
              >
                {x.name}
              </a>
            ))}
          </div>
          <button type="button" className={`btn btn-secondary ${buttonStyles}`}>
            &gt;
          </button>
        </div>
      </div>
    )
  }
}
export default ListNavigator
