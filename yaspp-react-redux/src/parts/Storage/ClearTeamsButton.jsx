import { IconButton } from '../../components/IconButton'
import { connect } from 'react-redux'
import { clearTeams } from '../../actions/ActionBuilder'

const mapDispatchToProps = (dispatch) => ({
  handleClick: () => {
    dispatch(clearTeams())
  },
})

const mapStateToProps = (state) => ({
  icon: 'trash',
  disabled: false,
})

const ClearTeamsButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(IconButton)
export default ClearTeamsButton
