/*
chlorides [0, 501.87]   AVG: 22.8 MEDIAN: 22.8
do [0.31, 60]   AVG: 6.7 MEDIAN: 6.7
ecoli [0, 210000]   AVG: 132 MEDIAN: 132
flow [56.8, 6120]  AVG:412 MEDIAN:412
height [2.93, 21.25]  AVG:5.11 MEDIAN:5.11
nitrates [0, 184.49]   AVG: 1.2 MEDIAN: 1.2
ph [5.58, 12.4]   AVG: 8.04 MEDIAN: 8.04
phosphorus [0, 26.3]   AVG: 0.222 MEDIAN: 0.222
spc [2, 2141]   AVG: 509 MEDIAN: 509
tds [351, 700]   AVG: 583 MEDIAN: 583
temp [3.5, 34.1]   AVG: 20.1 MEDIAN: 20.1
tss [0, 408]   AVG: 5.5 MEDIAN: 5.5

raining [NaN, NaN]   AVG: 0 MEDIAN: 0
wet [0, 1]   AVG: 0 MEDIAN: 0
*/


import * as d3 from "d3";
import sprintf from "sprintf";


type SeriesNames = {
  [key: string]: string;
}

type SeriesScales = {
  [key: string]: any;
}


const interpolateBuYlRd = (x) => {
  return d3.interpolateRdYlBu(Math.abs(x - 1.0));
}

const datainfoScaleTransform = d3.scaleLinear().range([0.2, 1])
const interpolateDatainfo = (x) => {
  return d3.interpolateMagma(datainfoScaleTransform(x));
}


export const seriesIds = new Set([
  'siteId', 'date', 'bod', 'bodPercent', 'chlorides', 'do', 'doOutfall', 'doOutfall',
  'ecoli', 'flow', 'ibi', 'invertIndiana', 'invertMacro', 'invertMichigan',
  'invertNarrative', 'nitrates', 'ph', 'phosphorus', 'spc', 'tds',
  'temp', 'tss', 'turbidity', 'wet']);


export const scales: SeriesScales = {
  datainfo: d3.scaleSequential([365, 0], interpolateDatainfo).clamp(true),

  chlorides: d3.scaleSequential([0, 600], d3.interpolateGreens).clamp(true),
  do: d3.scaleSequential([0, 100], d3.interpolateGreens).clamp(true),
  ecoli: d3.scaleSequential([0, 1000], d3.interpolateYlOrBr).clamp(true),

  flow: d3.scaleSequential([0, 8000], d3.interpolateGnBu).clamp(true),
  height: d3.scaleSequential([0, 30], d3.interpolateBlues).clamp(true),
  nitrates: d3.scaleSequential([0, 15], d3.interpolatePurples).clamp(true),
  ph: d3.scaleSequential([5.5, 12.5], d3.interpolateTurbo).clamp(true),

  phosphorus: d3.scaleSequential([0, 0.5], d3.interpolateInferno).clamp(true),
  spc: d3.scaleSequential([0, 2500], d3.interpolateReds).clamp(true),
  tds: d3.scaleSequential([0, 800], d3.interpolatePuRd).clamp(true),
  temp: d3.scaleSequential([0, 35], interpolateBuYlRd).clamp(true),
  tss: d3.scaleSequential([0, 500], d3.interpolateRdPu).clamp(true)
}


export const labels: SeriesNames = {
  datainfo: "Last Measured (days ago)",

  flow: "Gage Flow (ft^3/s)",
  height: "Gage Height (ft)",

  chlorides: "Chlorides (mg/L)",
  do: "Dissolved Oxygen (mg/L)",
  ecoli: "E. Coli (CFU)",
  nitrates: "Nitrates (mg/L)",
  ph: "pH",
  phosphorus: "Phosphorus (mg/L)",
  spc: "Specific Conductance (uS/cm)",
  tds: "Total Dissolved Solids (mg/L)",
  temp: "Temperature (C)",
  tss: "Total Suspended Solids (mg/L)"
}

const numericFormats: SeriesNames = {
  ecoli: "%d",
  flow: "%d",
  nitrates: "%.2f",
  ph: "%.2f",
  phosphorus: "%.2f",
  spc: "%d",
  tds: "%d"
}


export function formatValue(series, value) {
  let fstr = numericFormats[series];
  if(!fstr) {
    fstr = "%.1f";
  }
  return sprintf(fstr, value);
}


export const radiusRange = [9, 20];
