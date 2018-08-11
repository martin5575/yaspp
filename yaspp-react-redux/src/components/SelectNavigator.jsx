import * as React from 'react'
import { Component } from 'react'
import DropDown from '../components/DropDown'

const previous = 'previous'
const next = 'next'
const select = 'select'

class SelectNavigator extends Component {
  constructor(props) {
    super(props)
  }

  onChange(event) {
    switch (event.target.id) {
      case next:
        this.props.onNext()
        break
      case previous:
        this.props.onPrevious()
        break
      case select:
        this.props.onSelect(event.target.value)
        break
      default:
        return
    }
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-2">
            <button
              className="btn form-control"
              id={previous}
              onClick={this.onChange.bind(this)}
            >
              {'<'}
            </button>
          </div>
          <div className="col-xs-8">
            <DropDown
              value={this.props.selected}
              onChange={this.onChange.bind(this)}
              id={select}
              data={this.props.data}
            />
          </div>
          <div className="col-xs-2">
            <button
              className="btn form-control"
              id={next}
              onClick={this.onChange.bind(this)}
            >
              {'>'}
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default SelectNavigator
