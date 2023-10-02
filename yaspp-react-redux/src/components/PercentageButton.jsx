import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'reactstrap'

export const PercentageButton = ({ onClick, disabled, state }) => {
  return (
    <Button
      type="button"
      className="btn btn-secondary"
      data-toggle="button"
      aria-pressed={state.ui.showPercentage}
      onClick={() => onClick(state)}
      disabled={disabled}
    >
      <FontAwesomeIcon icon="percentage" />
    </Button>
  )
}

