import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'


  function ListNavigator(props) {

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen((prevState) => !prevState);

    const onSelect = (event) => {
      if (!event) return;
      let node = event?.target
      while (!node?.id) {
        node = node.parentElement
      }
      props.onSelect(node.id)
    }

    if (!props.data) return <div />
    const buttonStyles = props.buttonStyles ? props.buttonStyles : ''
    const bgStyles = props.bgStyles ? props.bgStyles : ''

    const data = props.data
    const currentIndex = data.findIndex((x) => x.id === props.selected)
    const selectedItem = data[currentIndex]
    const nextIndex = currentIndex + 1
    const prevIndex = currentIndex - 1
    const nextId = nextIndex < data.length ? data[nextIndex].id : undefined
    const prevId = prevIndex >= 0 ? data[prevIndex].id : undefined

    return (
      <div className="btn-group" role="group">
      <div
        className={`btn-group ${bgStyles}`}
        role="group"
        aria-label="Button group with nested dropdown"
      >
        <Button

          id={prevId}
          className={`btn btn-secondary ${buttonStyles}`}
          disabled={prevId === undefined}
          onClick={e=>onSelect(e)}
        >
          <FontAwesomeIcon icon="caret-left" />
        </Button>
          <Dropdown isOpen={dropdownOpen} toggle={toggle} direction="down">
            <DropdownToggle caret>{selectedItem ? selectedItem.name : props.selected}</DropdownToggle>
            <DropdownMenu>
              {props.data.map((x) => (
                <DropdownItem
                  id={x.id}
                  key={x.id}
                  onClick={e=>onSelect(e)}
                >
                  {x.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Button
            id={nextId}
            className={`btn btn-secondary ${buttonStyles}`}
            onClick={e=>onSelect(e)}
            disabled={nextId === undefined}
          >
            <FontAwesomeIcon icon="caret-right" />
          </Button>
        </div>
      </div>
    )
  }

export default ListNavigator
