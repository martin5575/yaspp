import * as React from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { switchModel } from '../actions/ActionBuilder';

const OptionsButton = ({ onClick, disabled }) => {
  return (
    <button
      type="button"
      className="btn btn-secondary"
      onClick={onClick}
      disabled={disabled}
    >
      <FontAwesomeIcon icon="sliders-h" />
    </button>
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
