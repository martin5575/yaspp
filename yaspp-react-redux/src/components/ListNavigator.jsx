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

    const data = this.props.data
    const currentIndex = data.findIndex((x) => x.id === this.props.selection)
    console.log(currentIndex)
    const nextIndex = currentIndex + 1
    const prevIndex = currentIndex - 1
    const nextId = nextIndex < data.length ? data[nextIndex].id : undefined
    const prevId = prevIndex >= 0 ? data[prevIndex].id : undefined

    console.log(this.props.selection)
    console.log(nextId)
    console.log(prevId)

    return (
      <div
        className={`btn-group ${bgStyles}`}
        role="group"
        aria-label="Button group with nested dropdown"
      >
        <button
          type="button"
          id={prevId}
          className={`btn btn-secondary ${buttonStyles}`}
          disabled={prevId === undefined}
          onClick={this.props.onSelect}
        >
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
                onClick={this.props.onSelect}
              >
                {x.name}
              </a>
            ))}
          </div>
          <button
            type="button"
            id={nextId}
            className={`btn btn-secondary ${buttonStyles}`}
            onClick={this.props.onSelect}
            disabled={nextId === undefined}
          >
            &gt;
          </button>
        </div>
      </div>
    )
  }
}
export default ListNavigator
