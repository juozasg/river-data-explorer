import * as d3 from "d3";
import type { ColorScale } from "../../types";

import { radiusRange } from '../definitions';

// const radiusTicksXs = [10, 65, 128, 200, 280];
const radiusTicksXs = [2, 74, 150, 224, 298];


function average(scale) {
  return scale.copy().domain([0,1])(0.5);
}


function createSvg() {
  return d3.create("svg")
    .attr("height", 76)
    .style("display", "block")
    .style("overflow", "visible");
}

function createDataGroups(svg) {
  return svg.selectAll('circle')
    .data(radiusTicksXs) // cx
    .enter()
    .append("g")
    .attr("transform", d => `translate(${d},26)`);
}


function appendRadiusCircle(sel) {
  const radiusUnitScale = d3.scaleLinear().range(radiusRange);
  sel.append("circle")
    .attr("r", (d, i) => radiusUnitScale(i/4.0))
    .attr("stroke", "black")
    .attr("stroke-width", "2");

  return sel;
}



// colorScale maps domain to color [0, 5000.0] -> ['red', 'green']
// need a scale that maps series value domain to radius. ex: [0, 5000.0] -> [5, 20]
export function radiusListSvg(colorScale: ColorScale) {
  // [0,1] -> [0, 5000]
  const measurementUnitScale = d3.scaleLinear().range(colorScale.domain())

  // [0, 1] -> ['red', 'green']
  const colorUnitScale = colorScale.copy().domain([0,1]);

  const svg = createSvg();
  svg.attr('class', 'radius-list');
  const groups = createDataGroups(svg);
  appendRadiusCircle(groups)
    .attr('fill', (d,i) => colorUnitScale(i/4.0));

  const range = measurementUnitScale.range();

  return svg.node();
}

// ex: [0,1] => [5, 20]
export function measurementFrequencyRadiusListSvg(colorScale: ColorScale) {
  const color = average(colorScale);

  const longNames = ['Yearly', 'Monthly', 'Weekly', 'Daily', 'Real-time'];
  const names = ['Y', 'M', 'W', 'D', 'RT'];
  const freqInDays = [365, 30, 7, 1, 0];

  // data density values: [0, 1, 2, 3, 4, 5]
  const svg = createSvg();

  const groups = createDataGroups(svg);
  groups.attr('class', 'tippy')
    .attr('data-tippy-content', (d,i) => longNames[i]);

  // circle with radius
  appendRadiusCircle(groups)
    .attr('fill', (d,i) => colorScale(freqInDays[i]));

  // label
  groups.append("text")
    .attr("text-anchor", "middle")
    .attr("y", 40)
    .attr('fill', 'black')
    .text((d, i) => names[i]);


  return svg.node();
}