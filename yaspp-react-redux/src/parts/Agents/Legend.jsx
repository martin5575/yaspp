import React from 'react'
import { getAgentColorScale } from './colors'
import './Legend.css'

function Legend({ names, selectedNames, onToggle }) {
  if (!names || names.length === 0) return null
  const color = getAgentColorScale(names)
  const items = Array.from(new Set(names))
  const isSelected = (name) => {
    if (!selectedNames) return true
    if (selectedNames instanceof Set) return selectedNames.has(name)
    if (Array.isArray(selectedNames)) return selectedNames.includes(name)
    return true
  }
  return (
    <div className="legend-wrap">
      {items.map((name) => {
        const active = isSelected(name)
        return (
          <button
            key={`legend-${name}`}
            type="button"
            onClick={() => onToggle && onToggle(name)}
            className={`legend-chip ${active ? 'active' : 'inactive'}`}
            style={{ '--legend-border': color(name) }}
            aria-pressed={active}
            title={active ? 'Click to hide' : 'Click to show'}
          >
            <span
              className="legend-swatch"
              style={{ backgroundColor: color(name), opacity: active ? 1 : 0.4 }}
            />
            <span className="legend-label" style={{ opacity: active ? 1 : 0.7 }}>{name}</span>
          </button>
        )
      })}
    </div>
  )
}

export default Legend
