import * as React from 'react'
import { connect } from 'react-redux'
import ClearAllButton from './ClearAllButton'
import ClearTeamsButton from './ClearTeamsButton'
import ClearSeasonButton from './ClearSeasonButton'

const renderSeasonRow = (league, year, count) => {
  return (
    <div className="storage-row" key={`${league}_${year}`}>
      {year} ({count}) <ClearSeasonButton league={league} year={year} />
    </div>
  )
}

const StorageTemplate = ({ teamCount, leagues }) => {
  return (
    <div>
      <h3>
        Lokaler Speicher <ClearAllButton />
      </h3>
      <div className="storage-header">Allgemein</div>
      <div className="storage-row">
        Alle Mannschaften ({teamCount}) <ClearTeamsButton />
      </div>
      <div className="storage-header">Ligen</div>
      <div>{leagues.count}</div>
      {leagues.map((l) => (
        <div key={l.league}>
          <div className="storage-sub-header">{l.name}</div>
          {l.seasons.map((s) => renderSeasonRow(l.league, s.year, s.count))}
        </div>
      ))}
    </div>
  )
}

const mapStateToProps = (state) => ({
  teamCount: 10,
  leagues: [
    {
      league: 'bl1',
      name: '1. Bundesl.',
      seasons: [{ year: '1997', count: 34 }],
    },
  ],
})

const Storage = connect(mapStateToProps)(StorageTemplate)

export default Storage
