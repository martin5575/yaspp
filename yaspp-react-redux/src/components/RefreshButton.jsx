import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'reactstrap'

export const RefreshButton = ({ onClick, disabled, isUpdating, state }) => {
  return (
    <Button
      type="button"
      className="btn btn-secondary"
      onClick={() => onClick(state)}
      disabled={disabled && !isUpdating}
    >
      <FontAwesomeIcon icon="sync" spin={isUpdating} />
    </Button>
  )
}
