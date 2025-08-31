import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'reactstrap'

export const RefreshButton = ({ onClick, disabled, isUpdating, state, className, title }) => {
  return (
    <Button
      type="button"
  className={className || "btn btn-secondary"}
      onClick={() => onClick(state)}
      disabled={disabled && !isUpdating}
  title={title}
  aria-label={title}
    >
      <FontAwesomeIcon icon="sync" spin={isUpdating} />
    </Button>
  )
}
