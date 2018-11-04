import { connect } from 'react-redux'
import { RefreshButton } from '../components/RefreshButton'
import { refreshMatchs } from '../actions/ActionBuilder'

const mapStateToProps = (state) => ({
  disabled: false,
  isUpdating: state.ui.isRefreshingMatchs,
  state,
})

const mapDispatchToProps = (dispatch) => {
  return {
    onClick: (state) => {
      console.log('refresh')
      dispatch(refreshMatchs(state))
    },
  }
}

export const RefreshCurrentMatchDayButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(RefreshButton)
