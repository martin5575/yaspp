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
        console.log("BarChartRace componentDidMount", arguments)
        this.drawChart();
    }
    drawChart() {
        console.log("BarChartRace drawChart", arguments)
        const margin = {top: 16, right: 6, bottom: 6, left: 0};

        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

        const width = vw * 0.9
        const height = vh * 0.8

        const svg = d3.select(`#${this.props.id}`)
                    .append("svg")
                    .attr("width", '90vw')
                    .attr("height", '80vh')
                    .append("g")
                    .attr("id", "root")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const data = this.data.map(d => Object.assign(d, { value: sum(d.values)  }));
        console.log(data)
        const x = d3.scaleLinear([0, d3.max(data, d => d.value)], [margin.left, width - margin.right]);
        console.log(x)
        const rectHeight = 30;
        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("y", (d, i) => i * (rectHeight + 4))
            .attr("x", (d, i) => 10)
            .attr("height", rectHeight)
            .attr("width", (d, i) => x(d.value))
            .attr("fill", "lightgray")
            .attr("opacity", 0.5);
        
        svg.selectAll("text")
        .data(data)
        .enter()
            .append("text")
            .style("font", "bold 12px var(--sans-serif)")
            .attr("fill", "black")
            .attr("y", (d, i) => i * (rectHeight + 4) + 20)
            .attr("x", (d, i) => 15)
            .attr("font-size", "10px")
            .attr("height", rectHeight)
            .attr("width", (d, i) => width - margin.right - margin.left)
            .text((d, i) => d.name + "    " + d.value );
    }



    render() {
        console.log("BarChartRace render", arguments)
        this.data = this.props.data;
        return <div id={this.props.id}></div>
    }
}
export default BarChartRace;