import React, { useState } from 'react'
import { getDefinitions, getParams } from '../../stats/statsType'
import * as actionBuilder from '../../actions/ActionBuilder'

function AgentInfoView({ store }) {
  const [tab, setTab] = useState('about')
  const state = store.getState()
  const dynParams = state.ui.dynParams || getParams('dyn')
  const defaultParams = getParams('dyn')
  const dispatch = store.dispatch
  const update = (patch) => dispatch(actionBuilder.setDynParams({ ...dynParams, ...patch }))
  const reset = () => dispatch(actionBuilder.setDynParams(defaultParams))

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '16px 12px' }}>
      <div className='btn-group mb-3' role='group'>
        <button
          type='button'
          className={`btn btn-sm ${tab === 'about' ? 'btn-secondary' : 'btn-outline-secondary'}`}
          onClick={() => setTab('about')}
        >
          Agenten
        </button>
        <button
          type='button'
          className={`btn btn-sm ${tab === 'settings' ? 'btn-secondary' : 'btn-outline-secondary'}`}
          onClick={() => setTab('settings')}
        >
          Einstellungen
        </button>
      </div>

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

          {defaultParams && (
            <>
              <h6 className='mt-4 mb-2'>Dynamic Agent — Formel</h6>
              <pre style={{ background: '#f8f9fa', padding: 10, borderRadius: 4, fontSize: 12 }}>
                {`λ_eff = (1 − α) × λ_longterm + α × λ_recent\n` +
                  `λ_final = λ_eff × defense_factor (opponent)`}
              </pre>
            </>
          )}
        </>
      )}

      {tab === 'settings' && (
        <>
          <h6 className='mb-3'>Dynamic Agent — Einstellungen</h6>

          <div className='mb-3'>
            <label className='form-label d-flex justify-content-between'>
              <span><strong>α (alpha)</strong> — Formgewichtung</span>
              <span className='badge bg-secondary'>{dynParams.alpha.toFixed(2)}</span>
            </label>
            <input
              type='range' className='form-range'
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
            <input
              type='range' className='form-range'
              min={1} max={20} step={1}
              value={dynParams.recentN}
              onChange={e => update({ recentN: parseInt(e.target.value, 10) })}
            />
            <div className='d-flex justify-content-between' style={{ fontSize: 11, color: '#888' }}>
              <span>1</span><span>20</span>
            </div>
          </div>

          <div className='mb-4 form-check'>
            <input
              className='form-check-input' type='checkbox' id='dynDefenseMain'
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
