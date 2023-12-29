import React, { Component } from 'react'
import * as d3 from 'd3'
import { sum } from 'lodash';

class BarChartRace extends Component {

    dateValues = ["1", "2", "3"]
    data = [{
        name: "foo",
        values: [4, 8, 15]
    }, {
        name: "bar",
        values: [16, 23, 42]
    }, {
        name: "baz",
        values: [8, 16, 23]
    }, {
        name: "foobar",
        values: [15, 42, 8]
    } ];



    componentDidMount() {
        this.drawChart();
    }
    async drawChart() {
        const margin = {top: 16, right: 6, bottom: 6, left: 0};

        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

        const width = vw * 0.9
        const height = vh * 0.8
        const rectHeight = 30;

        const svg = d3.select(`#${this.props.id}`)
                    .append("svg")
                    .attr("width", '90vw')
                    .attr("height", '80vh')
                  
        const captionItem = svg.append("text")
          .style("font", `bold ${rectHeight*2}px var(--sans-serif)`)
          .style("font-variant-numeric", "tabular-nums")
          .attr("id", "caption")
          .attr("x", "1.5rem")
          .attr("y", margin.top)          
          .attr("dy", "0.32em")
          .attr("height", rectHeight)
          .attr("width", (d, i) => width - margin.right - margin.left)
          .text("caption");

        const root = svg.append("g")
          .attr("id", "root")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        const offset = margin.top;

        const data = this.data
        const max = _.max(data.map(x=>_.max(x.values)))
        const x = d3.scaleLinear([0, max], [margin.left, width - margin.right]);


        const frames = buildFrames(data, this.dateValues);
        const duration = 250;
        const zeroFrame = frames[0].map(d => Object.assign(d, { value: 0 }));

        updateFrame(root, zeroFrame);

        for (const frame of frames) {
            const transition = svg.transition()
                .duration(duration)
                .ease(d3.easeLinear)

            updateCaption(svg, frame);
            updateFrame(root, frame);
            await transition.end();
        }


        function updateFrame(svg, frame) {
            updateBars(svg, frame);
            updateLabels(svg, frame);
        }

        function updateCaption(svg, frame) {
          svg.select("#caption").transition(d3.transition).text(frame[0].dateValue);
        }

        function updateBars(svg, frame) {
            svg.selectAll("rect")
            .data(frame)
            .join(
                enter => enter.append("rect")
                .attr("id", (d, i) => "rect_"+d.name)
                .attr("y", (d, i) => offset + i * (rectHeight + 4))
                .attr("x", (d, i) => 10)
                .attr("height", rectHeight)
                .attr("width", (d, i) => x(d.value))
                .attr("fill", "lightgray")
                .attr("opacity", 0.5),
                update => update,
                exit => exit.transition(d3.transition)
                .attr("width", (d, i) => x(d.value))
            ).call(bar => bar.transition(d3.transition)
            .attr("width", (d, i) => x(d.value)))
        }

        function updateLabels(svg, frame) {
            svg.selectAll("text")
            .data(frame)
                .join(enter => 
                    enter.append("text")
                    .attr("id", (d, i) => "text_"+d.name)
                    .style("font", "bold 12px var(--sans-serif)")
                    .attr("fill", "black")
                    .attr("y", (d, i) => offset + i * (rectHeight + 4) + 20)
                    .attr("x", (d, i) => 20)
                    .attr("font-size", "1.5em")
                    .attr("height", rectHeight)
                    .attr("width", (d, i) => width - margin.right - margin.left)
                    .text((d, i) => d.name)
                    .call(text => text.append("tspan")
                    .attr("fill-opacity", 0.7)
                    .attr("font-weight", "normal")
                    .attr("x", "4em")),
                    update => update,
                    exit => exit.transition(d3.transition).call(g=>g.select("tspan").textTween(d=> (t) => d.value, 0))
                ).call(bar => bar.transition(d3.transition).call(g=>g.select("tspan").textTween(d=> (t) => d.value, 0)))

            }

        function buildFrames(data, dateValues) {
            const frames = [];
            for (let i = 0; i < dateValues.length; i++) {
                frames.push(data.map(d => ({
                    name: d.name,
                    value: d.values[i],
                    dateValue: dateValues[i]
                })));
            }
            return frames;
        }
    }



    render() {
        this.data = this.props.data;
        this.dateValues = this.props.dateValues
        return <div id={this.props.id}></div>
    }
}
export default BarChartRace;