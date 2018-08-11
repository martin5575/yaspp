import * as React from 'react'
import { Component } from 'react'

class ListNavigator extends Component {
  constructor(props) {
    super(props)
  }

  onSelect(event) {
    this.props.onSelect(event.target.id)
  }

  render() {
    console.log(this.props)
    if (!this.props.data) return <div />
    const buttonStyles = this.props.buttonStyles ? this.props.buttonStyles : ''
    const bgStyles = this.props.bgStyles ? this.props.bgStyles : ''

    const data = this.props.data
    const currentIndex = data.findIndex((x) => x.id === this.props.selected)
    const selectedItem = data[currentIndex]
    const nextIndex = currentIndex + 1
    const prevIndex = currentIndex - 1
    const nextId = nextIndex < data.length ? data[nextIndex].id : undefined
    const prevId = prevIndex >= 0 ? data[prevIndex].id : undefined

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
          onClick={this.onSelect.bind(this)}
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
            {selectedItem ? selectedItem.name : this.props.selected}
          </button>
          <div className="dropdown-menu" aria-labelledby="btnGroupDrop1">
            {this.props.data.map((x) => (
              <a
                className="dropdown-item"
                href="#"
                id={x.id}
                key={x.id}
                onClick={this.onSelect.bind(this)}
              >
                {x.name}
              </a>
            ))}
          </div>
          <button
            type="button"
            id={nextId}
            className={`btn btn-secondary ${buttonStyles}`}
            onClick={this.onSelect.bind(this)}
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
