import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const IconButton = ({ icon, disabled, handleClick }) => {
  return (
    <a href="#" onClick={handleClick} disabled={disabled}>
      <FontAwesomeIcon icon={icon} />
    </a>
  )
}
