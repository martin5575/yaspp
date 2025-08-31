import * as React from 'react'
import { Dropdown, DropdownItem } from 'reactstrap'

function DropDown({ value, onChange, id, data }) {
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
export default DropDown
