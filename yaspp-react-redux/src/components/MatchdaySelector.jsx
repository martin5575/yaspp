import React, { useMemo, useState } from 'react'
import './MatchdaySelector.css'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// days: array of { id, name }
// index: selected index in days
// onChange: (nextIndex:number) => void
// currentId?: number (optional shortcut target)
export default function MatchdaySelector({ days = [], index = 0, onChange, currentId }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [touchStartX, setTouchStartX] = useState(null)

  const toggle = () => setOpen(v => !v)

  const count = days.length
  const current = days[index] || {}

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return days
    return days.filter(d =>
      d.name?.toLowerCase().includes(q) || String(d.id).includes(q)
    )
  }, [days, query])

  const currentIdx = useMemo(() => days.findIndex(d => d?.id === currentId), [days, currentId])
  const canGoCurrent = typeof currentId === 'number' && currentIdx >= 0 && currentIdx !== index

  const goCurrent = () => { if (canGoCurrent) onChange?.(currentIdx) }

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
    <div className='md-selector' role='group' aria-label='Matchday selector' onKeyDown={onKey} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <Button className='md-btn' disabled={!count} onClick={()=>go(-1)} aria-label='Previous matchday'>
        <FontAwesomeIcon icon='caret-left' />
      </Button>

      <Dropdown isOpen={open} toggle={toggle} direction='down'>
        <DropdownToggle className='md-toggle' caret disabled={!count} title={count ? `Matchday ${index+1} of ${count}` : ''}>
          <div className='md-current'>
            <div className='md-line1'>{current?.name || '—'}</div>
            <span className='md-count' aria-live='polite'>{count ? `${index+1}/${count}` : '0/0'}</span>
          </div>
        </DropdownToggle>
        <DropdownMenu className='md-menu'>
          <div className='md-search' onClick={e=>e.stopPropagation()}>
            <input
              type='search'
              className='md-input'
              placeholder='Search matchday'
              value={query}
              onChange={e=>setQuery(e.target.value)}
            />
            <button className='md-clear' onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); setQuery('') }} aria-label='Clear search'>×</button>
            <button className='md-current-btn' disabled={!canGoCurrent} onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); goCurrent() }} title='Go to current matchday'>Current</button>
          </div>
          {filtered.map((d, i) => {
            const absoluteIdx = days.findIndex(x => x.id === d.id)
            return (
              <DropdownItem key={d.id} onClick={()=>onChange?.(absoluteIdx)} active={absoluteIdx===index} className='md-item'>
                <span className='md-item-label'>{d.name}</span>
              </DropdownItem>
            )
          })}
        </DropdownMenu>
      </Dropdown>

      <Button className='md-btn' disabled={!count} onClick={()=>go(1)} aria-label='Next matchday'>
        <FontAwesomeIcon icon='caret-right' />
      </Button>
    </div>
  )
}
