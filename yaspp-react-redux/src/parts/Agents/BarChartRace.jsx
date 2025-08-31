import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { getAgentColorScale } from './colors'

async function drawChart({ id, data, dateValues, runToken, containerWidth, onDone }) {
    if (!id || !data || !dateValues || data.length === 0 || (dateValues?.length || 0) === 0) {
        if (onDone) onDone()
        return
    }

    const margin = { top: 24, right: 16, bottom: 24, left: 8 }
    const barHeight = 28
    const barGap = 10
    const width = Math.max(320, containerWidth || (Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) * 0.9))
    const height = (barHeight + barGap) * data.length + margin.top + margin.bottom + 40

    // Clear previous render
    d3.select(`#${id}`).selectAll('*').remove()

    const svg = d3
        .select(`#${id}`)
        .append('svg')
        .attr('width', width)
        .attr('height', height)

    // Defs: shadow filter for bars
    const defs = svg.append('defs')
    const shadow = defs
        .append('filter')
        .attr('id', 'barShadow')
        .attr('height', '130%')
    shadow.append('feDropShadow').attr('dx', 2).attr('dy', 2).attr('stdDeviation', 2).attr('flood-opacity', 0.2)

    const root = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    // Offscreen text for measuring value label width
    const measureTextEl = svg
        .append('text')
        .attr('x', -9999)
        .attr('y', -9999)
        .style('opacity', 0)
        .style('font', '500 13px var(--sans-serif)')

    const textWidthWithFont = (s, font) => {
        measureTextEl.style('font', font).text(s)
        const node = measureTextEl.node()
        try {
            return node?.getComputedTextLength?.() || (s?.length || 0) * 7
        } catch {
            return (s?.length || 0) * 7
        }
    }
    const valueTextWidth = (s) => textWidthWithFont(s, '500 13px var(--sans-serif)')
    const nameTextWidth = (s) => textWidthWithFont(s, '600 14px var(--sans-serif)')

    const caption = svg
        .append('text')
        .attr('id', 'caption')
        .attr('x', width - margin.right)
        .attr('y', 18)
        .attr('text-anchor', 'end')
        .style('font', `bold 18px var(--sans-serif)`) 
        .style('font-variant-numeric', 'tabular-nums')

    // Shared color palette per name
    const names = data.map(d => d.name)
    const color = getAgentColorScale(names)

    const frames = buildFrames(data, dateValues)
    if (frames.length === 0) { if (onDone) onDone(); return }

    // X scale domain across all frames for stability
    const globalMax = d3.max(frames.flat(), d => d.value) || 0
    const x = d3.scaleLinear().domain([0, globalMax]).range([0, width - margin.left - margin.right])

    // Initialize with zero-width bars in initial rank
    const initial = rankFrame(frames[0]).map(d => ({ ...d, value: 0 }))
    update(root, initial)
    caption.text(frames[0][0]?.dateValue ?? '')

    const duration = 600
            for (const frameRaw of frames) {
                if (runToken && drawChart._cancelled?.has(runToken)) { if (onDone) onDone(); return }
                const frame = rankFrame(frameRaw)
                const t = svg.transition().duration(duration).ease(d3.easeCubicInOut)
                caption.transition(t).text(frame[0]?.dateValue ?? '')
                update(root, frame, t)
                try {
                    await t.end()
                } catch (e) {
                    // Transition was likely interrupted due to cleanup/HMR; exit quietly
                    if (onDone) onDone();
                    return
                }
            }
            if (onDone) onDone()

    function rankFrame(frame) {
        const sorted = [...frame].sort((a, b) => d3.descending(a.value, b.value))
        return sorted.map((d, i) => ({ ...d, rank: i }))
    }

        function update(g, frame, transition) {
            // Bars
            const barsSel = g.selectAll('rect.bar').data(frame, d => d.name)
            const bars = barsSel
                .join(
                    enter =>
                        enter
                            .append('rect')
                            .attr('class', 'bar')
                            .attr('rx', 6)
                            .attr('ry', 6)
                            .attr('filter', 'url(#barShadow)')
                            .attr('fill', d => color(d.name))
                            .attr('y', d => d.rank * (barHeight + barGap))
                            .attr('x', 0)
                            .attr('height', barHeight)
                            .attr('width', 0),
                    update => update,
                    exit => exit.transition(transition || d3.transition().duration(300)).attr('width', 0).remove()
                )

            if (transition) {
                bars.transition(transition)
                    .attr('y', d => d.rank * (barHeight + barGap))
                    .attr('width', d => x(d.value))
            } else {
                bars
                    .attr('y', d => d.rank * (barHeight + barGap))
                    .attr('width', d => x(d.value))
            }

            // Name labels
        const labelsSel = g.selectAll('text.name').data(frame, d => d.name)
            const labels = labelsSel
                .join(
                    enter =>
                        enter
                            .append('text')
                            .attr('class', 'name')
                .attr('x', 6)
                            .attr('y', d => d.rank * (barHeight + barGap) + barHeight / 2)
                            .attr('dy', '0.35em')
                .attr('text-anchor', 'start')
                            .style('font', '600 14px var(--sans-serif)')
                            .text(d => d.name),
                    update => update,
                    exit => exit.remove()
                )

            if (transition) {
                labels.transition(transition)
            .attr('y', d => d.rank * (barHeight + barGap) + barHeight / 2)
            .attr('x', 6)
            } else {
                labels
            .attr('y', d => d.rank * (barHeight + barGap) + barHeight / 2)
            .attr('x', 6)
            }

            // Value labels at end of bar
            const valuesSel = g.selectAll('text.value').data(frame, d => d.name)
            const values = valuesSel
                .join(
                    enter =>
                        enter
                            .append('text')
                            .attr('class', 'value')
                            .attr('x', d => x(d.value) + 8)
                            .attr('y', d => d.rank * (barHeight + barGap) + barHeight / 2)
                            .attr('dy', '0.35em')
                            .attr('text-anchor', 'start')
                            .style('font', '500 13px var(--sans-serif)')
                            .style('fill', '#111')
                            .text(d => formatValue(d.value)),
                    update => update,
                    exit => exit.remove()
                )

            if (transition) {
                values.transition(transition)
                    .attr('x', function (d) {
                        const w = x(d.value)
                        const s = formatValue(d.value)
                        const valW = valueTextWidth(s)
                        const titleW = nameTextWidth(d.name)
                        const nameLeft = 6
                        const nameRight = nameLeft + titleW
                        const minGap = titleW // requested: gap equals title width
                        const minLeftForValue = nameRight + minGap
                        // try inside if space
                        const canInside = (w - valW - 6) >= minLeftForValue && (w > (valW + 14))
                        this.__inside = !!canInside
                        return canInside ? Math.max(10, w - 10) : Math.max(w + 8, minLeftForValue)
                    })
                    .attr('y', d => d.rank * (barHeight + barGap) + barHeight / 2)
                    .attr('text-anchor', function () { return this.__inside ? 'end' : 'start' })
                    .style('fill', function () { return this.__inside ? '#fff' : '#111' })
                    .tween('text', function (d) {
                        const i = d3.interpolateNumber(parseFloat(this.textContent) || 0, d.value)
                        return function (t) {
                            this.textContent = formatValue(i(t))
                        }
                    })
            } else {
                values
                    .attr('x', function (d) {
                        const w = x(d.value)
                        const s = formatValue(d.value)
                        const valW = valueTextWidth(s)
                        const titleW = nameTextWidth(d.name)
                        const nameLeft = 6
                        const nameRight = nameLeft + titleW
                        const minGap = titleW
                        const minLeftForValue = nameRight + minGap
                        const canInside = (w - valW - 6) >= minLeftForValue && (w > (valW + 14))
                        this.__inside = !!canInside
                        return canInside ? Math.max(10, w - 10) : Math.max(w + 8, minLeftForValue)
                    })
                    .attr('y', d => d.rank * (barHeight + barGap) + barHeight / 2)
                    .attr('text-anchor', function () { return this.__inside ? 'end' : 'start' })
                    .style('fill', function () { return this.__inside ? '#fff' : '#111' })
                    .text(d => formatValue(d.value))
            }
        }

    function buildFrames(data, dateValues) {
        const frames = []
        for (let i = 0; i < dateValues.length; i++) {
            frames.push(
                data.map(d => ({
                    name: d.name,
                    value: d.values[i] ?? 0,
                    dateValue: dateValues[i],
                }))
            )
        }
        return frames
    }

    function formatValue(v) {
        return Math.round(v).toString()
    }
}

function BarChartRace(props) {
    const runRef = useRef(0)
    const containerRef = useRef(null)
    const [runKey, setRunKey] = useState(0)
    const [isRunning, setIsRunning] = useState(false)
    const [isFading, setIsFading] = useState(false)

    useEffect(() => {
        if (!runKey) return
        runRef.current += 1
        const token = `${props.id || 'running-points-chart'}::${runRef.current}`
        drawChart._cancelled = drawChart._cancelled || new Set()
        const containerId = props.id || 'running-points-chart'
        // Clear any previous render
        d3.select(`#${containerId} svg`).interrupt().remove()

        const cw = containerRef.current?.clientWidth || (Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) * 0.9)
    setIsRunning(true)
    drawChart({ id: containerId, data: props.data || [], dateValues: props.dateValues || [], runToken: token, containerWidth: cw, onDone: () => { setIsRunning(false); setIsFading(false) } })

        return () => {
            // Cancel and cleanup
            drawChart._cancelled.add(token)
            d3.select(`#${containerId} svg`).interrupt().remove()
        }
    }, [props.id, props.data, props.dateValues, runKey])

    // Overlay play button styles (transparent triangle, no background)
    const overlayBtnStyle = {
        background: 'transparent',
        border: 'none',
        padding: 0,
        lineHeight: 0,
        cursor: 'pointer',
        transition: 'opacity .4s ease',
        opacity: isFading ? 0 : 1,
        pointerEvents: isFading ? 'none' : 'auto',
        outline: 'none',
    }

    // Predict height for centering overlay before render
    const barHeight = 28, barGap = 10, marginTop = 24, marginBottom = 24
    const predictedHeight = (barHeight + barGap) * (props.data?.length || 0) + marginTop + marginBottom + 40
    const canRun = (props.data && props.data.length > 0) && (props.dateValues && props.dateValues.length > 0)

    return (
        <div style={{ position: 'relative', width: '100%', minHeight: Math.max(240, predictedHeight) }}>
            {(!isRunning || isFading) && (
                <button
                    style={{
                        ...overlayBtnStyle,
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 2,
                    }}
                    onClick={() => {
                        if (isRunning || isFading || !canRun) return
                        setIsFading(true)
                        // Kick off run after fade starts; overlay remains until fade completes
                        setTimeout(() => setRunKey(k => (k || 0) + 1), 60)
                    }}
                    aria-label="Start animation"
                    title={"Start animation"}
                >
                    <svg width="160" height="160" viewBox="0 0 160 160" role="img" aria-hidden="true">
                        <polygon
                            points="55,40 120,80 55,120"
                            fill="none"
                            stroke={canRun ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.25)'}
                            strokeWidth="12"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            )}
            {(!isRunning && !canRun) && (
                <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', color:'#777', fontSize:12}}>
                    No data to animate
                </div>
            )}
            <div id={props.id || 'running-points-chart'} ref={containerRef} style={{ width: '100%' }}></div>
        </div>
    )
}

export default BarChartRace