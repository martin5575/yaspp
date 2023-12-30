import React, { Component } from 'react'
import * as d3 from 'd3'
import { sum } from 'lodash';
import { Button, FormGroup, Input, Label } from 'reactstrap';

const normalizeName = (name) => {
    return name.replace(/[^a-zA-Z0-9]/g, "_")
}

class ChartDetailsView extends Component {

    visibleLines = []
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
        const margin = {top: 16, right: 6, bottom: 50, left: 40};

        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

        const width = vw * 0.9
        const height = vh * 0.5
        const rectHeight = 30;

        const svg = d3.select(`#${this.props.id}`)
                    .append("svg")
                    .attr("width", '90vw')
                    .attr("height", '50vh')
                    .append("g")
                    .attr("transform",
                          "translate(" + margin.left + "," + margin.top + ")");
                  
        // const root = svg.append("g")
        //   .attr("id", "root")
        //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        // Add X axis --> it is a date format
        const x = d3.scaleLinear([1, this.dateValues.length+1], [ 0, width ]);
        svg.append("g")
            .attr("transform", "translate(0," + (height-margin.top-margin.bottom) + ")")
            .attr("id", "x-axis")
            .attr("stroke-width", 1)
            .attr("color", "black")
            .call(d3.axisBottom(x).ticks(this.dateValues.length));

        // Add Y axis
        const max = _.max(this.data.map(x=>_.max(x.values)))
        const y = d3.scaleLinear([-4, max] , [ height, 0 ])
        svg.append("g")
            .attr("id", "y-axis")
            .call(d3.axisLeft(y).ticks(max));

        // color palette
        const color = d3.scaleOrdinal()
            .domain(this.data.map(x=>x.name))
            .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#33ff33','#a65628','#f781bf'])


        // Draw the line
        svg.selectAll(".line")
            .data(this.data)
            .enter()
            .append("path")
                .attr("fill", "none")
                .attr("stroke", d=> {
                    //console.log("stroke", d, color(d))
                    return color(d)
                })
                .attr("id", d => "line_"+normalizeName(d.name))
                .attr("stroke-width", 1.5)
                .attr("visibility", (d,i)=>{
                    //console.log("visible", d, i, this.visibleLines, this.visibleLines.includes(d.name))
                    return this.visibleLines.includes(d.name) ? "visible" : "hidden"
                })
                .attr("d", d => {
                    //console.log(d)
                    return d3.line(this.data)
                    .x((foo, i) => { 
                        // console.log("x", foo, i, x(i))
                        return x(i+1) 
                    })
                    .y((baa, i) => { 
                        // console.log("y", baa, i, y(baa)) 
                        return y(baa)}
                    )
                    (d.values)})

        // Add the points
        svg.selectAll(".point")
                        .data(this.data)
                        .enter()
                    .append("text")
                    .attr("x", (d, i) => (i+1)*30+"px")
                    .attr("y", (d) => (height-margin.top-10)+"px")
                    .style("font-size", "14px")
                    .attr("stroke", d=> color(d))
                    .text((d) => d.name)
    
    }

    



    render() {
        this.data = this.props.data;
        this.dateValues = this.props.dateValues

        const toggleVisibility = (name) => {
            const selector = "#line_"+normalizeName(name)
            const state = d3.select(selector).attr("visibility")
            if (state==="visible") {
                d3.select(selector).attr("visibility", "hidden")
            } else {
                d3.select(selector).attr("visibility", "visible")
            }
        }
        

        return <>
            <div className="d-flex flex-wrap">
                {this.data.map(x=>{
                    return (
                        <Button key={"rb_"+x.name}
                            onClick={()=>toggleVisibility(x.name)}
                        >{x.name} </Button>)
            })}
            </div>
           <div id={this.props.id}></div>
        </>
    }
}
export default ChartDetailsView;