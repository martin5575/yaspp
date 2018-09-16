import * as React from 'react'
import { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class ListNavigator extends Component {
  onSelect(event) {
    let node = event.target
    while (!node.id) {
      node = node.parentElement
    }
    this.props.onSelect(node.id)
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
          <FontAwesomeIcon icon="caret-left" />
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
              <button
                type="button"
                className="dropdown-item"
                id={x.id}
                key={x.id}
                onClick={this.onSelect.bind(this)}
              >
                {x.name}
              </button>
            ))}
          </div>
          <button
            type="button"
            id={nextId}
            className={`btn btn-secondary ${buttonStyles}`}
            onClick={this.onSelect.bind(this)}
            disabled={nextId === undefined}
          >
            <FontAwesomeIcon icon="caret-right" />
          </button>
        </div>
      </div>
    )
  }
}
export default ListNavigator
