import * as React from 'react'
import { connect } from 'react-redux'
import { RefreshButton } from '../components/RefreshButton'

const mapStateToProps = (state) => ({
  onClick: () => {
    console.log('refresh')
  },
  disabled: false,
  isUpdating: state.ui.isUpdatingCurrentMatchDay,
})

export const RefreshCurrentMatchDayButton = connect(mapStateToProps)(
  RefreshButton
)
