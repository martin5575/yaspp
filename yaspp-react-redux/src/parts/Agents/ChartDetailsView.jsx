import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import _ from 'lodash'
import { getAgentColorScale } from './colors'

const normalizeName = (name) => {
    return name.replace(/[^a-zA-Z0-9]/g, "_")
}

function ChartDetailsView(props) {
    const containerRef = useRef(null)
    const visibleLines = useRef([])

    useEffect(() => {
        if (props.id) {
            d3.select(`#${props.id}`).selectAll("*").remove()
        }

        const margin = {top: 16, right: 16, bottom: 48, left: 48};

    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    const containerEl = document.getElementById(props.id)
    const outerWidth = (containerEl?.clientWidth ?? (Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) * 0.9))
        const outerHeight = vh * 0.5
        const width = outerWidth - margin.left - margin.right
        const height = outerHeight - margin.top - margin.bottom

        const svg = d3.select(`#${props.id}`)
                    .append("svg")
                    .attr("width", outerWidth)
                    .attr("height", outerHeight)
                    .append("g")
                    .attr("transform",
                          "translate(" + margin.left + "," + margin.top + ")");

        const n = props.dateValues.length
        const x = d3.scalePoint()
            .domain(d3.range(1, n+1))
            .range([0, width])
            .padding(0.5)

        // Prepare series based on toggle
        const series = (props.data || []).map(s => ({
            name: s.name,
            values: props.isCumulative
                ? s.values.reduce((acc, v, i) => {
                    acc.push((acc[i-1] || 0) + (v || 0))
                    return acc
                }, [])
                : s.values
        }))

        const allValues = series.flatMap(s => s.values)
        const yMax = d3.max(allValues) || 0
        const y = d3.scaleLinear()
            .domain([0, yMax])
            .nice()
            .range([height, 0])

        // gridlines
        svg.append('g')
            .attr('class', 'y-grid')
            .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(''))
            .selectAll('line').attr('stroke', '#eee')

        // axes
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("id", "x-axis")
            .call(d3.axisBottom(x)
                .tickValues(d3.range(1, n+1))
                .tickFormat((d)=> {
                    const raw = props.dateValues[d-1]
                    if (!raw) return d
                    return String(raw).replace(/\bspieltag\b\s*/i, '').trim()
                }))
            .selectAll("text")
            .style('font-size', '10px')
            .attr('transform', 'rotate(0)')

        svg.append("g")
            .attr("id", "y-axis")
            .call(d3.axisLeft(y).ticks(5))

    const color = getAgentColorScale(series.map(x=>x.name))

        const lineGen = d3.line()
            .x((d, i) => x(i+1))
            .y((d) => y(d))
            .curve(d3.curveMonotoneX)

        // draw lines
        const paths = svg.selectAll("path.series")
            .data(series)
            .join("path")
            .attr("class", "series")
            .attr("fill", "none")
            .attr("stroke", d=> color(d.name))
            .attr("stroke-width", 2)
            .attr("d", d => lineGen(d.values))

        // animate path draw
        paths.each(function() {
            const p = d3.select(this)
            const total = typeof this.getTotalLength === 'function' ? this.getTotalLength() : 0
            p.attr('stroke-dasharray', `${total} ${total}`)
             .attr('stroke-dashoffset', total)
             .transition().duration(800).ease(d3.easeCubicOut)
             .attr('stroke-dashoffset', 0)
        })

        // draw points with titles
        const points = series.flatMap(s => s.values.map((v, i) => ({ name: s.name, value: v, idx: i })))
        svg.selectAll('circle.dot')
            .data(points)
            .join('circle')
            .attr('class', 'dot')
            .attr('r', 3)
            .attr('cx', d => x(d.idx+1))
            .attr('cy', d => y(d.value))
            .attr('fill', d => color(d.name))
            .append('title')
        .text(d => `${d.name} • ${props.dateValues[d.idx]}: ${d.value}${props.isCumulative ? ' (cum.)' : ''}`)

    }, [props.id, props.data, props.dateValues, props.isCumulative])
    return <div id={props.id} ref={containerRef}></div>
}
export default ChartDetailsView;