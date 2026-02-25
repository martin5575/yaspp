import * as React from 'react';
import { useRef, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import './TeamFormChart.css';

/**
 * Team Form Chart Component
 * Displays last 5 matches with W/L/D indicators, scores, and opponents
 * 
 * @param {Object} props
 * @param {string} props.teamId - ID of the team to display form for
 * @param {Array} props.matches - Array of match objects
 * @param {Object} props.teamData - Team information (name, logo, etc.)
 * @param {number} props.width - Chart width (default: 400)
 * @param {number} props.height - Chart height (default: 120)
 */
const TeamFormChart = ({ 
  teamId, 
  matches, 
  teamData = {}, 
  width = 400, 
  height = 120 
}) => {
  const svgRef = useRef();
  const tooltipRef = useRef();

  // Process last 5 matches for the specific team
  const formMatches = useMemo(() => {
    if (!matches || !teamId) return [];
    
    // Filter matches involving this team and sort by date (newest first)
    const teamMatches = matches
      .filter(match => 
        (match.Team1?.TeamId === teamId || match.Team2?.TeamId === teamId) &&
        match.MatchResults?.length > 0
      )
      .sort((a, b) => new Date(b.MatchDateTime) - new Date(a.MatchDateTime))
      .slice(0, 5) // Last 5 matches
      .reverse(); // Oldest to newest for left-to-right display
    
    return teamMatches.map(match => {
      const isHome = match.Team1?.TeamId === teamId;
      const opponent = isHome ? match.Team2 : match.Team1;
      const teamGoals = isHome ? 
        (match.MatchResults.find(r => r.ResultName === 'Endergebnis')?.PointsTeam1 || 0) :
        (match.MatchResults.find(r => r.ResultName === 'Endergebnis')?.PointsTeam2 || 0);
      const opponentGoals = isHome ? 
        (match.MatchResults.find(r => r.ResultName === 'Endergebnis')?.PointsTeam2 || 0) :
        (match.MatchResults.find(r => r.ResultName === 'Endergebnis')?.PointsTeam1 || 0);
      
      let result;
      if (teamGoals > opponentGoals) result = 'W';
      else if (teamGoals < opponentGoals) result = 'L';
      else result = 'D';
      
      return {
        matchId: match.MatchID,
        date: new Date(match.MatchDateTime),
        isHome,
        opponent: {
          id: opponent?.TeamId,
          name: opponent?.TeamName || opponent?.teamName || 'Unknown',
          shortName: opponent?.ShortName || opponent?.shortName || 'UNK'
        },
        score: `${teamGoals}-${opponentGoals}`,
        result,
        teamGoals,
        opponentGoals,
        competition: match.LeagueName || 'Bundesliga'
      };
    });
  }, [matches, teamId]);

  useEffect(() => {
    if (!svgRef.current || formMatches.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const chart = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X scale (matches)
    const xScale = d3.scaleBand()
      .domain(formMatches.map((_, i) => i))
      .range([0, chartWidth])
      .padding(0.3);

    // Y scale (for result circles)
    const yScale = d3.scaleLinear()
      .domain([-1, 1])
      .range([chartHeight, 0]);

    // Draw match circles
    const resultColors = {
      'W': '#4CAF50', // Green for win
      'D': '#9E9E9E', // Gray for draw
      'L': '#F44336'  // Red for loss
    };

    const resultLabels = {
      'W': 'Win',
      'D': 'Draw', 
      'L': 'Loss'
    };

    // Draw result circles
    chart.selectAll('.result-circle')
      .data(formMatches)
      .enter()
      .append('circle')
      .attr('class', 'result-circle')
      .attr('cx', (_, i) => xScale(i) + xScale.bandwidth() / 2)
      .attr('cy', () => yScale(0))
      .attr('r', 20)
      .attr('fill', d => resultColors[d.result])
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        // Highlight circle
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 24)
          .attr('stroke-width', 3);

        // Show tooltip
        const tooltip = d3.select(tooltipRef.current);
        tooltip
          .style('opacity', 1)
          .html(`
            <div class="tooltip-content">
              <strong>${d.isHome ? 'Home' : 'Away'} vs ${d.opponent.name}</strong><br/>
              Score: ${d.score}<br/>
              Result: ${resultLabels[d.result]}<br/>
              Date: ${d.date.toLocaleDateString()}<br/>
              ${d.competition}
            </div>
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        // Restore circle
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 20)
          .attr('stroke-width', 2);

        // Hide tooltip
        d3.select(tooltipRef.current)
          .transition()
          .duration(300)
          .style('opacity', 0);
      });

    // Add result letters inside circles
    chart.selectAll('.result-text')
      .data(formMatches)
      .enter()
      .append('text')
      .attr('class', 'result-text')
      .attr('x', (_, i) => xScale(i) + xScale.bandwidth() / 2)
      .attr('y', () => yScale(0) + 5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('font-weight', 'bold')
      .attr('font-size', '14px')
      .text(d => d.result);

    // Add score below circles
    chart.selectAll('.score-text')
      .data(formMatches)
      .enter()
      .append('text')
      .attr('class', 'score-text')
      .attr('x', (_, i) => xScale(i) + xScale.bandwidth() / 2)
      .attr('y', chartHeight + 25)
      .attr('text-anchor', 'middle')
      .attr('fill', '#333')
      .attr('font-size', '12px')
      .text(d => d.score);

    // Add opponent abbreviation
    chart.selectAll('.opponent-text')
      .data(formMatches)
      .enter()
      .append('text')
      .attr('class', 'opponent-text')
      .attr('x', (_, i) => xScale(i) + xScale.bandwidth() / 2)
      .attr('y', chartHeight + 40)
      .attr('text-anchor', 'middle')
      .attr('fill', '#666')
      .attr('font-size', '11px')
      .attr('font-weight', '500')
      .text(d => d.opponent.shortName);

    // Add home/away indicator
    chart.selectAll('.venue-indicator')
      .data(formMatches)
      .enter()
      .append('text')
      .attr('class', 'venue-indicator')
      .attr('x', (_, i) => xScale(i) + xScale.bandwidth() / 2)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#888')
      .attr('font-size', '10px')
      .text(d => d.isHome ? 'H' : 'A');

    // Add form summary
    const winCount = formMatches.filter(m => m.result === 'W').length;
    const drawCount = formMatches.filter(m => m.result === 'D').length;
    const lossCount = formMatches.filter(m => m.result === 'L').length;
    
    chart.append('text')
      .attr('class', 'form-summary')
      .attr('x', chartWidth / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .attr('fill', '#333')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text(`Form: ${winCount}W ${drawCount}D ${lossCount}L`);

    // Add team name if provided
    if (teamData.name) {
      chart.append('text')
        .attr('class', 'team-name')
        .attr('x', chartWidth / 2)
        .attr('y', -45)
        .attr('text-anchor', 'middle')
        .attr('fill', '#1976d2')
        .attr('font-size', '16px')
        .attr('font-weight', 'bold')
        .text(teamData.name);
    }

  }, [formMatches, width, height]);

  if (!teamId || !matches || matches.length === 0) {
    return (
      <div className="team-form-chart-empty">
        <p>No match data available for team form</p>
      </div>
    );
  }

  if (formMatches.length === 0) {
    return (
      <div className="team-form-chart-empty">
        <p>Insufficient match history for form analysis</p>
      </div>
    );
  }

  return (
    <div className="team-form-chart-container">
      <svg 
        ref={svgRef} 
        width={width} 
        height={height}
        className="team-form-chart"
      />
      <div 
        ref={tooltipRef}
        className="team-form-tooltip"
        style={{ opacity: 0 }}
      />
    </div>
  );
};

export default TeamFormChart;