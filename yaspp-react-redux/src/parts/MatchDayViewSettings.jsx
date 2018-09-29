import * as React from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const OptionsButton = ({ onClick, disabled }) => {
  return (
    <button
      type="button"
      className="btn btn-secondary"
      onClick={onClick}
      disabled={disabled}
    >
      <FontAwesomeIcon icon="ellipsis-v" />
    </button>
  )
}

const mapStateToProps = (state) => ({
  onClick: () => {
    console.log('refresh')
  },
  disabled: true,
})

export const MatchDayViewSettings = connect(mapStateToProps)(OptionsButton)
