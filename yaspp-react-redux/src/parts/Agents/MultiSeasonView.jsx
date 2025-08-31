import React, { useEffect } from 'react'
import * as d3 from 'd3'
import { getAgentColorScale } from './colors'

function MultiSeasonView({ id, seasons, series }) {
  useEffect(() => {
    if (!id) return
    if (!seasons || seasons.length === 0) {
      d3.select(`#${id}`).selectAll('*').remove()
      d3.select(`#${id}`).append('div').text('No seasons to display.')
      return
    }
    d3.select(`#${id}`).selectAll('*').remove()
    const container = document.getElementById(id)
    const outerWidth = container?.clientWidth || Math.min(900, (Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) * 0.9))
    const outerHeight = 320
    const margin = { top: 16, right: 16, bottom: 48, left: 56 }
    const width = outerWidth - margin.left - margin.right
    const height = outerHeight - margin.top - margin.bottom

    const svg = d3.select(`#${id}`)
      .append('svg')
      .attr('width', outerWidth)
      .attr('height', outerHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scalePoint()
      .domain(seasons.map(String))
      .range([0, width])
      .padding(0.5)

    const allValues = series.flatMap(s => s.values)
    const y = d3.scaleLinear()
      .domain([0, d3.max(allValues) || 0]).nice()
      .range([height, 0])

    // grid
    svg.append('g')
      .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(''))
      .selectAll('line').attr('stroke', '#eee')

    // axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text').style('font-size', '10px')

    svg.append('g').call(d3.axisLeft(y).ticks(5))

    const color = getAgentColorScale(series.map(s => s.name))
    const line = d3.line()
      .x((d, i) => x(String(seasons[i])))
      .y(d => y(d))
      .curve(d3.curveMonotoneX)

    const paths = svg.selectAll('path.series')
      .data(series)
      .join('path')
      .attr('class', 'series')
      .attr('fill', 'none')
      .attr('stroke', d => color(d.name))
      .attr('stroke-width', 2)
      .attr('d', d => line(d.values))

    // animate draw
    paths.each(function () {
      const p = d3.select(this)
      const total = typeof this.getTotalLength === 'function' ? this.getTotalLength() : 0
      p.attr('stroke-dasharray', `${total} ${total}`)
        .attr('stroke-dashoffset', total)
        .transition().duration(800).ease(d3.easeCubicOut)
        .attr('stroke-dashoffset', 0)
    })

    // points + title
    const points = series.flatMap(s => s.values.map((v, i) => ({ name: s.name, value: v, i })))
    svg.selectAll('circle.pt')
      .data(points)
      .join('circle')
      .attr('class', 'pt')
      .attr('r', 3)
      .attr('cx', d => x(String(seasons[d.i])))
      .attr('cy', d => y(d.value))
      .attr('fill', d => color(d.name))
      .append('title')
      .text(d => `${d.name} • ${seasons[d.i]}: ${d.value}`)
  }, [id, seasons, series])

  // table of sums per strategy
  const totals = (series||[]).map(s => ({ name: s.name, total: Math.round(s.values.reduce((a, b) => a + (b || 0), 0)) }))
    .sort((a, b) => b.total - a.total)

  return (
    <div>
      <div id={id} />
      <div className='table-responsive mt-3'>
        <table className='table table-sm table-striped align-middle'>
          <thead>
            <tr>
              <th style={{width:'40%'}}>Strategy</th>
              <th style={{width:'20%'}}>Total</th>
              <th style={{width:'40%'}}>Across seasons</th>
            </tr>
          </thead>
          <tbody>
            {totals.map(row => (
              <tr key={`ms-${row.name}`}>
                <td>{row.name}</td>
                <td>{row.total}</td>
                <td>
                  <div className='d-flex' style={{gap:6}}>
                    {series.find(s=>s.name===row.name)?.values.map((v,i)=> (
                      <span key={`v-${i}`} className='badge bg-light text-dark border' title={`${seasons[i]}: ${v}`}>{v}</span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MultiSeasonView
