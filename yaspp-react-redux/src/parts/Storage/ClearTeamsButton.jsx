import { IconButton } from '../../components/IconButton'
import { connect } from 'react-redux'

const clearTeams = (state) => {
  console.log('clearTeams')
}

const mapStateToProps = (state) => ({
  icon: 'trash',
  onClick: clearTeams,
  disabled: false,
  state,
})

const ClearTeamsButton = connect(mapStateToProps)(IconButton)
export default ClearTeamsButton
