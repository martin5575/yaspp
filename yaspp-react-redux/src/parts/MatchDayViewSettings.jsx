import * as React from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'reactstrap'

const OptionsButton = ({ onClick, disabled }) => {
  return (
    <Button
      className="btn btn-secondary"
      onClick={onClick}
      disabled={disabled}
    >
      <FontAwesomeIcon icon="ellipsis-v" />
    </Button>
  )
}

const mapStateToProps = (state) => ({
  onClick: () => {
    console.log('refresh')
  },
  disabled: true,
})

export const MatchDayViewSettings = connect(mapStateToProps)(OptionsButton)
