import * as d3 from 'd3'

// Returns a stable ordinal color scale for agent names
export function getAgentColorScale(names) {
  const uniqueSorted = Array.from(new Set(names)).sort()
  const palette = d3.schemeTableau10.concat(d3.schemeSet3)
  return d3.scaleOrdinal().domain(uniqueSorted).range(palette)
}
