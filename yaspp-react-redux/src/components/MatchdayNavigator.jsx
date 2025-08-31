import * as React from 'react'
import { useEffect, useState, useMemo } from 'react'
import MatchdaySelector from './MatchdaySelector'

import {
  dispatchFetchMatchs,
  dispatchSelectMatchDay,
} from '../actions/ActionBuilderWithStore'

import { areSelectedMatchsPresent } from '../utils/storeHelpers'
import { getSelectedMatchDays } from '../utils/filter'
import {
  getSelectedLeague,
  getSelectedYear,
  getSelectedMatchDay,
} from '../reducers/selectors/uiSelector'
import { getCurrentMatchDay } from '../reducers/selectors/modelSelector'
import { RefreshCurrentMatchDayButton } from '../parts/RefreshCurrentMatchDayButton'
import { MatchDayOptionsButton } from '../parts/MatchDayOptionsButton'
import { PercentageButton } from './PercentageButton'
import * as actionBuilder from '../actions/ActionBuilder'
import './TopbarButtons.css'

function MatchdayNavigator({ store, hideActions }) {
  const [, setTick] = useState(0)

  useEffect(() => {
    const unsubscribe = store.subscribe(() => setTick((t) => t + 1))
    return () => unsubscribe && unsubscribe()
  }, [store])

  const state = store.getState()
  const relevantMatchDays = getSelectedMatchDays(state) || []
  const selectedMatchDay = getSelectedMatchDay(state)
  const currentMatchDay = getCurrentMatchDay(state)

  const index = useMemo(() => {
    return Math.max(0, relevantMatchDays.findIndex(x => x.id === selectedMatchDay))
  }, [relevantMatchDays, selectedMatchDay])

  function onSelect(id) {
    dispatchSelectMatchDay(store, parseInt(id, 10))
    if (!areSelectedMatchsPresent(store)) {
      const st = store.getState()
      dispatchFetchMatchs(
        store,
        getSelectedLeague(st),
        getSelectedYear(st),
        getSelectedMatchDay(st)
      )
    }
  }

  const onChangeIndex = (nextIdx) => {
    const next = relevantMatchDays[nextIdx]
    if (next) onSelect(next.id)
  }

  const onTogglePercentage = (s) => {
    store.dispatch(actionBuilder.showPercentage(!s.ui.showPercentage))
  }

  return (
    <div className='d-flex align-items-center' style={{ gap: 4, flexWrap: 'nowrap' }}>
      <MatchdaySelector
        days={relevantMatchDays}
        index={index}
        onChange={onChangeIndex}
        currentId={currentMatchDay?.id}
      />
  <div className='btn-group' role='group' aria-label='Matchday actions' style={{ visibility: hideActions ? 'hidden' : 'visible' }}>
  <RefreshCurrentMatchDayButton className='tb-btn btn btn-sm' title='Refresh matches' />
  <PercentageButton className='tb-btn btn btn-sm' title='Toggle percentage' state={state} onClick={onTogglePercentage} />
  <MatchDayOptionsButton className='tb-btn btn btn-sm' title='Switch model' selectedModelId={state.ui.selectedModelId} />
      </div>
    </div>
  )
}

export default MatchdayNavigator
