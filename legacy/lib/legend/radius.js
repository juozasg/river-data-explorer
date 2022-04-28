import * as d3 from "d3";

import {radiusTicksXs, radiusRange} from '../data/enums.js';

function average(scale) {
  return scale.copy().domain([0,1])(0.5);
}


function createSvg() {
  return d3.create("svg")
    .attr("height", 80)
    .style("display", "block");
}

function createDataGroups(svg) {
  return svg.selectAll('circle')
    .data(radiusTicksXs) // cx
    .enter()
    .append("g")
    .attr("transform", d => `translate(${d + 36},30)`);
}


function appendRadiusCircle(sel) {
  const radiusUnitScale =  d3.scaleLinear().range(radiusRange);
  sel.append("circle")
    .attr("r", (d, i) => radiusUnitScale(i/4.0))
    .attr("stroke", "black")
    .attr("stroke-width", "2");

  return sel;
}


// scale maps variable value domain to radius. ex: [0, 5000.0] -> [5, 20]
export function measurementRadiusLegend(colorScale) {
  const color = average(colorScale);
  // map domain [0,1] to variable value (observation/measurement)
  const measurementUnitScale = d3.scaleLinear().range(colorScale.domain())

  const colorUnitScale = colorScale.copy().domain([0,1]);
  
  const svg = createSvg();
  const groups = createDataGroups(svg);
  appendRadiusCircle(groups, color)
    .attr('fill', (d,i) => colorUnitScale(i/4.0));


  // LABEL
  groups.append("text")
    .attr('fill', 'black')
    .attr("text-anchor", "middle")
    .attr("y", 40)
    .text((d, i) => {
      let value = measurementUnitScale(i/4.0);
      if(colorScale.range()[1] > 10) {
        return Math.floor(value);
      } else {
        return value;
      }
    });


  return svg.node();
}

// ex: [0,1] => [5, 20]
export function samplingFrequencyRadiusLegend(colorScale) {
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