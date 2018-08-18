import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const RefreshButton = ({ onClick, disabled, isUpdating }) => {
  return (
    <button
      type="button"
      className="btn btn-secondary"
      onClick={onClick}
      disabled={disabled && !isUpdating}
    >
      <FontAwesomeIcon icon="sync" spin={isUpdating} />
    </button>
  )
}
