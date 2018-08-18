import * as React from 'react'

export const RefreshButton = ({ onClick, disabled, isUpdating }) => {
  return (
    <button
      type="button"
      className="btn btn-secondary"
      onClick={onClick}
      disabled={disabled && !isUpdating}
    >
      {isUpdating ? 'Updating' : 'Refresh'}
    </button>
  )
}
