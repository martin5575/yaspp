import { IconButton } from '../../components/IconButton'
import { connect } from 'react-redux'
import { clearSeason } from '../../actions/ActionBuilder'

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleClick: () => {
    dispatch(clearSeason(ownProps.league, ownProps.year))
  },
})

const mapStateToProps = (state, ownProps) => ({
  icon: 'trash',
  disabled: false,
})

const ClearSeasonButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(IconButton)
export default ClearSeasonButton
