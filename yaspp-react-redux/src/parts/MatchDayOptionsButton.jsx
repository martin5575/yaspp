import * as React from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { switchModel } from '../actions/ActionBuilder';
import { Button } from 'reactstrap'

const OptionsButton = ({ onClick, disabled }) => {
  return (
    <Button
      className="btn btn-secondary"
      onClick={onClick}
      disabled={disabled}
    >
      <FontAwesomeIcon icon="sliders-h" />
    </Button>
  )
}

const mapStateToProps = (state) => ({
  disabled: false
})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(switchModel(ownProps.selectedModelId)) 
    }
  }
}

export const MatchDayOptionsButton = connect(mapStateToProps, mapDispatchToProps)(OptionsButton)
