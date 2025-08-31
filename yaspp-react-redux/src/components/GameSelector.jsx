import React, { useMemo, useState } from 'react'
import './GameSelector.css'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'

export default function GameSelector({ matches, teams, index, onChange, logoSize=32 }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const toggle = () => setOpen(v => !v)
  const [touchStartX, setTouchStartX] = useState(null)

  const items = useMemo(() => {
    return (matches || []).map((m, i) => {
      const h = teams[m.teamHomeId]
      const a = teams[m.teamAwayId]
      const label = `${h?.shortName?.slice(0,3)?.toUpperCase() ?? ''} vs ${a?.shortName?.slice(0,3)?.toUpperCase() ?? ''}`
      const time = moment(m.matchDateTime).format('ddd HH:mm')
      const dateKey = moment(m.matchDateTime).format('YYYY-MM-DD')
      const dateLabel = moment(m.matchDateTime).format('ddd, DD MMM')
      return { i, h, a, label, time, dateKey, dateLabel, finished: !!m.isFinished }
    })
  }, [matches, teams])

  const count = items.length
  const current = items[index] || {}

  const go = (delta) => {
    if (!count) return
    const next = (index + count + delta) % count
    onChange?.(next)
  }

  const onKey = (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
    if (e.key === 'Home') { e.preventDefault(); onChange?.(0) }
    if (e.key === 'End') { e.preventDefault(); onChange?.(count - 1) }
  }

  const goNextOpen = () => {
    if (!items.length) return
    const after = items.find(it => it.i > index && !it.finished)
    const first = items.find(it => !it.finished)
    const target = after ?? first
    if (target) onChange?.(target.i)
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(it =>
      it.label.toLowerCase().includes(q) ||
      it.time.toLowerCase().includes(q) ||
      it.h?.shortName?.toLowerCase().includes(q) ||
      it.a?.shortName?.toLowerCase().includes(q)
    )
  }, [items, query])

  const groupedByDate = useMemo(() => {
    if (query.trim()) return { all: { label: '', items: filtered } }
    return filtered.reduce((acc, it) => {
      const key = it.dateKey
      if (!acc[key]) acc[key] = { label: it.dateLabel, items: [] }
      acc[key].items.push(it)
      return acc
    }, {})
  }, [filtered, query])

  const onTouchStart = (e) => setTouchStartX(e.changedTouches?.[0]?.clientX ?? null)
  const onTouchEnd = (e) => {
    if (open) return
    if (touchStartX == null) return
    const x = e.changedTouches?.[0]?.clientX ?? touchStartX
    const dx = x - touchStartX
    if (Math.abs(dx) > 40) go(dx > 0 ? -1 : 1)
    setTouchStartX(null)
  }

  return (
    <div className='game-selector' role='group' aria-label='Match selector' onKeyDown={onKey} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <Button className='gs-btn' disabled={!count} onClick={()=>go(-1)} aria-label='Previous match'>
        <FontAwesomeIcon icon='caret-left' />
      </Button>

      <Dropdown isOpen={open} toggle={toggle} direction='down'>
    <DropdownToggle className='gs-toggle' caret disabled={!count} title={count ? `Match ${index+1} of ${count}` : ''}>
          <div className='gs-current'>
      {current.h && <img className='gs-logo' src={current.h.iconUrl} alt={current.h.name} />}
            <div className='gs-labels'>
              <div className='gs-line1'>{current.label || '—'}</div>
              <div className='gs-line2'>{current.time || ''}</div>
            </div>
      {current.a && <img className='gs-logo' src={current.a.iconUrl} alt={current.a.name} />}
            <span className='gs-count' aria-live='polite'>{count ? `${index+1}/${count}` : '0/0'}</span>
          </div>
        </DropdownToggle>
        <DropdownMenu className='gs-menu'>
          <div className='gs-search' onClick={e=>e.stopPropagation()}>
            <input
              type='search'
              className='gs-input'
              placeholder='Search team or time'
              value={query}
              onChange={e=>setQuery(e.target.value)}
            />
            <button className='gs-clear' onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); setQuery('') }} aria-label='Clear search'>×</button>
          </div>
          {Object.entries(groupedByDate).map(([key, grp]) => (
            <div key={key} className='gs-group'>
              {grp.label && <div className='gs-group-label'>{grp.label}</div>}
              {grp.items.map(it => (
                <DropdownItem key={it.i} onClick={()=>onChange?.(it.i)} active={it.i===index} className='gs-item'>
                  <img src={it.h?.iconUrl} alt={it.h?.name} height={24} width={24} />
                  <span className='gs-item-label'>{it.label}</span>
                  <span className='gs-item-time'>{it.time}</span>
                  <img src={it.a?.iconUrl} alt={it.a?.name} height={24} width={24} />
                </DropdownItem>
              ))}
            </div>
          ))}
        </DropdownMenu>
      </Dropdown>

      <Button className='gs-btn' disabled={!count} onClick={()=>go(1)} aria-label='Next match'>
        <FontAwesomeIcon icon='caret-right' />
      </Button>

      <Button className='gs-skip' disabled={!count} onClick={goNextOpen} title='Next open match'>Next open</Button>

  {/* counter moved inside toggle */}
    </div>
  )
}
