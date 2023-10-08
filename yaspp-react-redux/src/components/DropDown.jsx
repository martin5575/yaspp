import * as React from 'react'
import { Component } from 'react'
import { Dropdown, DropdownItem } from 'reactstrap'

class DropDown extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const value = this.props.value
    const onChange = this.props.onChange
    const id = this.props.id
    const data = this.props.data
    return (
      <Dropdown
        value={value}
        className="form-control dropdown"
        onChange={onChange}
        id={id}
      >
        {data.map((g) => (
          <DropdownItem value={g.id} key={g.id}>
            {g.name}
          </DropdownItem>
        ))}
      </Dropdown>
    )
  }
}
export default DropDown
