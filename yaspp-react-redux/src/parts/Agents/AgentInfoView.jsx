import React, { useState } from 'react'
import { getDefinitions, getParams } from '../../stats/statsType'
import * as actionBuilder from '../../actions/ActionBuilder'
import { aggregateSeasonInfo } from '../../stats/seasonInfo'
import { getAllLeagues, getAllTeams, getAllYearsByLeague, getAllMatchs } from '../../reducers/selectors/modelSelector'
import { getSelectedLeague, getSelectedYear } from '../../reducers/selectors/uiSelector'

function AgentInfoView({ store }) {
  const state = store.getState()
  const [tab, setTab] = useState('about')

  const currentLeague = getSelectedLeague(state)
  const currentYear = getSelectedYear(state)
  const [statsLeague, setStatsLeague] = useState(currentLeague)
  const [statsYear, setStatsYear] = useState(currentYear)

  const dynParams = state.ui.dynParams || getParams('dyn')
  const defaultParams = getParams('dyn')
  const dispatch = store.dispatch
  const update = (patch) => dispatch(actionBuilder.setDynParams({ ...dynParams, ...patch }))
  const reset = () => dispatch(actionBuilder.setDynParams(defaultParams))

  const leagues = getAllLeagues(state) || []
  const yearsByLeague = getAllYearsByLeague(state) || {}
  const allMatchs = getAllMatchs(state) || []
  const teams = getAllTeams(state) || {}

  const availableYears = yearsByLeague[statsLeague] || []

  const handleLeagueChange = (league) => {
    setStatsLeague(league)
    const years = yearsByLeague[league] || []
    if (years.length > 0) setStatsYear(years[0].id)
  }

  const seasonMatchs = allMatchs.filter(
    m => m.league === statsLeague && m.year === statsYear && m.isFinished
  )

  const seasonInfo = aggregateSeasonInfo(seasonMatchs)
    .filter(x => x.tm > 0)
    .sort((a, b) => (b.tgf / b.tm) - (a.tgf / a.tm))

  const fmt = (n, d = 2) => (n != null && isFinite(n) ? n.toFixed(d) : '—')

  function teamName(id) {
    const t = teams[id]
    return t?.shortName || t?.name || id
  }
  function teamLogo(id) {
    return teams[id]?.iconUrl
  }

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: '16px 12px' }}>
      <div className='btn-group mb-3' role='group'>
        <button type='button'
          className={`btn btn-sm ${tab === 'about' ? 'btn-secondary' : 'btn-outline-secondary'}`}
          onClick={() => setTab('about')}>
          Agenten
        </button>
        <button type='button'
          className={`btn btn-sm ${tab === 'stats' ? 'btn-secondary' : 'btn-outline-secondary'}`}
          onClick={() => setTab('stats')}>
          Torwahrscheinlichkeiten
        </button>
        <button type='button'
          className={`btn btn-sm ${tab === 'settings' ? 'btn-secondary' : 'btn-outline-secondary'}`}
          onClick={() => setTab('settings')}>
          Einstellungen
        </button>
      </div>

      {/* ── About ── */}
      {tab === 'about' && (
        <>
          <h6 className='mb-2'>Alle Agenten</h6>
          <table className='table table-sm table-bordered'>
            <thead className='table-light'>
              <tr><th style={{ width: 60 }}>Agent</th><th>Beschreibung</th></tr>
            </thead>
            <tbody>
              {getDefinitions().map(def => (
                <tr key={def.key} style={def.key === 'dyn' ? { background: '#f0f7ff' } : {}}>
                  <td><strong>{def.short}</strong></td>
                  <td>{def.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h6 className='mt-4 mb-2'>Dynamic Agent — Formel</h6>
          <pre style={{ background: '#f8f9fa', padding: 10, borderRadius: 4, fontSize: 12 }}>
            {`λ_eff   = (1 − α) × λ_longterm + α × λ_recent\n` +
              `λ_final = λ_eff × defense_factor (opponent)`}
          </pre>
        </>
      )}

      {/* ── Long-term goal probabilities per team ── */}
      {tab === 'stats' && (
        <>
          <div className='d-flex align-items-center gap-2 mb-3' style={{ flexWrap: 'wrap' }}>
            <select
              className='form-select form-select-sm'
              style={{ width: 'auto' }}
              value={statsLeague}
              onChange={e => handleLeagueChange(e.target.value)}
            >
              {leagues.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
            <select
              className='form-select form-select-sm'
              style={{ width: 'auto' }}
              value={statsYear}
              onChange={e => setStatsYear(Number(e.target.value))}
            >
              {availableYears.map(y => (
                <option key={y.id} value={y.id}>{y.name}</option>
              ))}
            </select>
          </div>

          {seasonInfo.length === 0 ? (
            <p className='text-muted' style={{ fontSize: 13 }}>
              Keine Daten für diese Liga / Saison geladen.
            </p>
          ) : (
            <table className='table table-sm table-bordered'>
              <thead className='table-light'>
                <tr>
                  <th>Team</th>
                  <th className='text-center' title='Gespielte Spiele'>Sp</th>
                  <th className='text-center' title='Ø Tore pro Spiel (Langzeitwert λ)'>λ gesamt</th>
                  <th className='text-center' title='Ø Tore pro Heimspiel'>λ Heim</th>
                  <th className='text-center' title='Ø Tore pro Auswärtsspiel'>λ Ausw.</th>
                  <th className='text-center' title='Defensivfaktor (kassierte Tore / Liga-Ø — &lt;1 = starke Abwehr)'>Def</th>
                </tr>
              </thead>
              <tbody>
                {seasonInfo.map(info => {
                  const lambdaTotal = info.tm > 0 ? info.tgf / info.tm : null
                  const lambdaHome  = info.hm > 0 ? info.hgf / info.hm : null
                  const lambdaAway  = info.am > 0 ? info.agf / info.am : null
                  return (
                    <tr key={info.team}>
                      <td>
                        <span className='d-flex align-items-center gap-1'>
                          {teamLogo(info.team) && (
                            <img src={teamLogo(info.team)} alt='' style={{ width: 16, height: 16, objectFit: 'contain' }} />
                          )}
                          {teamName(info.team)}
                        </span>
                      </td>
                      <td className='text-center'>{info.tm}</td>
                      <td className='text-center fw-semibold'>{fmt(lambdaTotal)}</td>
                      <td className='text-center'>{fmt(lambdaHome)}</td>
                      <td className='text-center'>{fmt(lambdaAway)}</td>
                      <td className='text-center'
                        style={{ color: info.tdf < 0.95 ? '#198754' : info.tdf > 1.05 ? '#dc3545' : undefined }}>
                        {fmt(info.tdf)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
          <p className='text-muted mt-1' style={{ fontSize: 11 }}>
            λ = erwartete Tore pro Spiel · Def &lt; 1: starke Abwehr · Def &gt; 1: schwache Abwehr
          </p>
        </>
      )}

      {/* ── dyn settings ── */}
      {tab === 'settings' && (
        <>
          <h6 className='mb-3'>Dynamic Agent — Einstellungen</h6>

          <div className='mb-3'>
            <label className='form-label d-flex justify-content-between'>
              <span><strong>α (alpha)</strong> — Formgewichtung</span>
              <span className='badge bg-secondary'>{dynParams.alpha.toFixed(2)}</span>
            </label>
            <input type='range' className='form-range'
              min={0.05} max={0.95} step={0.05}
              value={dynParams.alpha}
              onChange={e => update({ alpha: parseFloat(e.target.value) })}
            />
            <div className='d-flex justify-content-between' style={{ fontSize: 11, color: '#888' }}>
              <span>0.05 (nur Saison)</span><span>0.95 (nur Form)</span>
            </div>
          </div>

          <div className='mb-3'>
            <label className='form-label d-flex justify-content-between'>
              <span><strong>N (recentN)</strong> — Letzte Spiele</span>
              <span className='badge bg-secondary'>{dynParams.recentN}</span>
            </label>
            <input type='range' className='form-range'
              min={1} max={20} step={1}
              value={dynParams.recentN}
              onChange={e => update({ recentN: parseInt(e.target.value, 10) })}
            />
            <div className='d-flex justify-content-between' style={{ fontSize: 11, color: '#888' }}>
              <span>1</span><span>20</span>
            </div>
          </div>

          <div className='mb-4 form-check'>
            <input className='form-check-input' type='checkbox' id='dynDefenseMain'
              checked={dynParams.useDefenseFactor}
              onChange={e => update({ useDefenseFactor: e.target.checked })}
            />
            <label className='form-check-label' htmlFor='dynDefenseMain'>
              <strong>Defensefaktor</strong> berücksichtigen
            </label>
          </div>

          <button className='btn btn-sm btn-outline-secondary' onClick={reset}>
            Standardwerte wiederherstellen
          </button>
        </>
      )}
    </div>
  )
}

export default AgentInfoView
