import { IconButton } from '../../components/IconButton'
import { connect } from 'react-redux'
import { clearAll } from '../../actions/ActionBuilder'

const mapDispatchToProps = (dispatch) => ({
  handleClick: () => {
    dispatch(clearAll())
  },
})

const mapStateToProps = (state) => ({
  icon: 'trash-alt',
  disabled: false,
})

const ClearAllButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(IconButton)
export default ClearAllButton
