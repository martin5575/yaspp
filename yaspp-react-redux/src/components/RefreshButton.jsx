import * as React from 'react'

export const RefreshButton = ({ onClick, disabled, isUpdating }) => {
  return (
    <button onClick={onClick} disabled={disabled && !isUpdating}>
      {isUpdating ? 'Updating' : 'Refresh'}
    </button>
  )
}
