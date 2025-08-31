import * as React from 'react'
import {
  getIsInitializing,
  getIsLoadingLeagues,
  getIsLoadingYears,
  getIsLoadingAllMatchDays,
  getIsLoadingTeams,
  getIsLoadingMatchDay,
} from '../reducers/selectors/uiSelector'

export default function LoadingPage({ store }) {
  const state = store.getState()
  if (getIsInitializing(state)) return <h2>Intializing...</h2>
  if (getIsLoadingLeagues(state)) return <h2>Loading Leagues...</h2>
  if (getIsLoadingYears(state)) return <h2>Loading Years...</h2>
  if (getIsLoadingAllMatchDays(state)) return <h2>Loading Matchdays...</h2>
  if (getIsLoadingTeams(state)) return <h2>Loading Teams...</h2>
  if (getIsLoadingMatchDay(state)) return <h2>Loading Matchs...</h2>
  return null
}
