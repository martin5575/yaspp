import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'reactstrap'

export const IconButton = ({ icon, disabled, handleClick }) => {
  return (
    <Button color='link' onClick={handleClick} disabled={disabled}>
      <FontAwesomeIcon icon={icon} />
    </Button>
  )
}
