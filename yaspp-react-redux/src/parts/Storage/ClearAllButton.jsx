import { IconButton } from '../../components/IconButton'
import { connect } from 'react-redux'

const clearAll = (state) => {
  console.log('clearAll')
}

const mapStateToProps = (state) => ({
  icon: 'trash-alt',
  onClick: clearAll,
  disabled: false,
  state,
})

const ClearAllButton = connect(mapStateToProps)(IconButton)
export default ClearAllButton
