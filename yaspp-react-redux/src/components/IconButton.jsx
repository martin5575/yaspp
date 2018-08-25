import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const IconButton = ({ icon, onClick, disabled, state }) => {
  return (
    <a href="#" onClick={() => onClick(state)} disabled={disabled}>
      <FontAwesomeIcon icon={icon} />
    </a>
  )
}
