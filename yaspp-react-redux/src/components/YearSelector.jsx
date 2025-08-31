import React, { useMemo, useState } from 'react'
import './YearSelector.css'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// years: array of { id, name }
// selectedId: number|string
// onSelect: (id) => void
export default function YearSelector({ years = [], selectedId, onSelect }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [touchStartX, setTouchStartX] = useState(null)
  const toggle = () => setOpen(v => !v)

  const data = years
  const count = data?.length || 0
  const index = Math.max(0, data.findIndex(y => y.id === selectedId))
  const current = data[index] || {}

  const go = (delta) => {
    if (!count) return
    const next = (index + count + delta) % count
    onSelect?.(data[next].id)
  }

  const onKey = (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
    if (e.key === 'Home') { e.preventDefault(); onSelect?.(data[0]?.id) }
    if (e.key === 'End') { e.preventDefault(); onSelect?.(data[count-1]?.id) }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return data
    return data.filter(y => String(y.name).toLowerCase().includes(q) || String(y.id).includes(q))
  }, [data, query])

  const latestId = useMemo(() => (data.slice().sort((a,b)=> (''+a.id).localeCompare(''+b.id))[data.length-1]?.id), [data])
  const canGoLatest = latestId != null && latestId !== selectedId
  const goLatest = () => { if (canGoLatest) onSelect?.(latestId) }

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
    <div className='year-selector' role='group' aria-label='Season selector' onKeyDown={onKey} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <Button className='tb-btn btn btn-sm' disabled={!count} onClick={()=>go(-1)} aria-label='Previous season'>
        <FontAwesomeIcon icon='caret-left' />
      </Button>
      <Dropdown isOpen={open} toggle={toggle} direction='down'>
        <DropdownToggle className='ys-toggle' caret disabled={!count} title={count ? `Season ${index+1} of ${count}` : ''}>
          <div className='ys-current'>
            <div className='ys-line1'>{current?.name ?? '—'}</div>
            <span className='ys-count' aria-live='polite'>{count ? `${index+1}/${count}` : '0/0'}</span>
          </div>
        </DropdownToggle>
        <DropdownMenu className='ys-menu'>
          <div className='ys-search' onClick={e=>e.stopPropagation()}>
            <input
              type='search'
              className='ys-input'
              placeholder='Search season'
              value={query}
              onChange={e=>setQuery(e.target.value)}
            />
            <button className='ys-clear' onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); setQuery('') }} aria-label='Clear search'>×</button>
            <button className='ys-latest-btn' disabled={!canGoLatest} onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); goLatest() }} title='Go to latest season'>Latest</button>
          </div>
          {filtered.map((y) => (
            <DropdownItem key={y.id} onClick={()=>onSelect?.(y.id)} active={y.id===selectedId} className='ys-item'>
              <span className='ys-item-label'>{y.name}</span>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      <Button className='tb-btn btn btn-sm' disabled={!count} onClick={()=>go(1)} aria-label='Next season'>
        <FontAwesomeIcon icon='caret-right' />
      </Button>
    </div>
  )
}
