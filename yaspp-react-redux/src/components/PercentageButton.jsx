import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const PercentageButton = ({ onClick, disabled, state }) => {
  return (
    <button
      type="button"
      className="btn btn-secondary"
      data-toggle="button"
      aria-pressed={state.ui.showPercentage}
      onClick={() => onClick(state)}
      disabled={disabled}
    >
      <FontAwesomeIcon icon="percentage" />
    </button>
  )
}

