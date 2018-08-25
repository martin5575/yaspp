import { IconButton } from '../../components/IconButton'
import { connect } from 'react-redux'

const clearTeams = (leagueId) => (state) => {
  console.log('clearTeams ' + leagueId)
}

const mapStateToProps = (leagueId) => (state) => ({
  icon: 'trash',
  onClick: clearTeams(leagueId),
  disabled: false,
  state,
})

export const ClearTeams = (leagueId) =>
  connect(mapStateToProps(leagueId))(IconButton)
