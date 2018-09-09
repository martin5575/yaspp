import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const IconButton = ({ icon, disabled, handleClick }) => {
  console.log(arguments)
  return (
    <a href="#" onClick={handleClick} disabled={disabled}>
      <FontAwesomeIcon icon={icon} />
    </a>
  )
}
