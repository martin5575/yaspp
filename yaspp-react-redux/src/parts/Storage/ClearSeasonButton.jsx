import { IconButton } from '../../components/IconButton'
import { connect } from 'react-redux'

const clearTeams = (league, yeear) => (state) => {
  console.log('clearTeams ' + league)
}

const mapStateToProps = (league, yeear) => (state) => ({
  icon: 'trash',
  onClick: clearTeams(league, yeear),
  disabled: false,
  state,
})

const ClearSeasonButton = (league, year) =>
  connect(mapStateToProps(league, year))(IconButton)

export default ClearSeasonButton
