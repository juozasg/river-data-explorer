import * as d3 from "d3";
import sprintf from "sprintf";
import { model } from "./data/model";


type SeriesNames = {
  [key: string]: string;
}

type SeriesScales = {
  [key: string]: any;
}

type SeriesCategoryNames = {
  [key: string]: {[key: string]: string};
}

type SeriesCategoryColors = {
  [key: string]: {[key: string]: string};
}

const interpolateBuYlRd = (x) => {
  return d3.interpolateRdYlBu(Math.abs(x - 1.0));
}

const datainfoScaleTransform = d3.scaleLinear().range([0.2, 1])
const interpolateDatainfo = (x) => {
  return d3.interpolateMagma(datainfoScaleTransform(x));
}


// export const seriesIds = new Set([
//   'siteId', 'date', 'bod', 'bodPercent', 'chlorides', 'do', 'doContactTank', 'doOutfall',
//   'ecoli', 'flow', 'ibi', 'invertIndiana', 'invertMacro', 'invertMichigan',
//   'invertNarrative', 'nitrates', 'ph', 'phosphorus', 'spc', 'tds',
//   'temp', 'tss', 'turbidity', 'wet']);


export const labels: SeriesNames = {
  datainfo: "Last Measured",

  temp: "Temperature",
  flow: "Gage Flow",
  height: "Gage Height",
  wet: "Ground Condition is Wet",

  do: "Dissolved Oxygen",
  doContactTank: "Dissolved Oxygen - Contact Tank",
  doOutfall: "Dissolved Oxygen - Outfall",
  bod: "Biological Oxygen Demand",
  bodPercent: "Biological Oxygen Demand",
  doPerc: "Dissolved Oxygen % Saturation",

  ecoli: "E. Coli",
  fishIbi: "Fish IBI",
  invertMacro: "Invertebrate Macro Score",
  invertIndiana: "Invertebrate Indiana Score",
  invertMichigan: "Invertebrate Michigan Score",
  chlorophyll: "Chlorophyll-a",

  chlorides: "Chlorides",
  nitrates: "Nitrates",
  phosphorus: "Phosphorus",
  ph: "pH",

  spc: "Specific Conductance",
  tds: "Total Dissolved Solids",
  tss: "Total Suspended Solids",
  turbidity: "Turbidity"
}


export const scales: SeriesScales = {
  bod: d3.scaleSequential([0, 10], d3.interpolateBlues).clamp(true),
  bodPercent: d3.scaleSequential([0, 100], d3.interpolateInferno).clamp(true),
  chlorides: d3.scaleSequential([0, 600], d3.interpolateGreens).clamp(true),
  datainfo: d3.scaleSequential([365, 0], interpolateDatainfo).clamp(true),
  do: d3.scaleSequential([0, 100], d3.interpolateGreens).clamp(true),
  doContactTank: d3.scaleSequential([0, 100], d3.interpolateGreens).clamp(true),
  doOutfall: d3.scaleSequential([0, 100], d3.interpolateGreens).clamp(true),
  ecoli: d3.scaleSequential([0, 1000], d3.interpolateYlOrBr).clamp(true),
  fishIbi: d3.scaleSequential([0, 60], d3.interpolateRdYlBu).clamp(true),
  flow: d3.scaleSequential([0, 8000], d3.interpolateGnBu).clamp(true),
  height: d3.scaleSequential([0, 30], d3.interpolateBlues).clamp(true),
  invertIndiana: d3.scaleSequential([0, 60], d3.interpolateRdYlBu).clamp(true),
  invertMacro: d3.scaleSequential([-10, 60], d3.interpolateRdYlBu).clamp(true),
  invertMichigan: d3.scaleSequential([-10, 10], d3.interpolateRdYlBu).clamp(true),
  nitrates: d3.scaleSequential([0, 15], d3.interpolatePurples).clamp(true),
  ph: d3.scaleSequential([5.5, 12.5], d3.interpolateTurbo).clamp(true),
  phosphorus: d3.scaleSequential([0, 0.5], d3.interpolateInferno).clamp(true),
  spc: d3.scaleSequential([0, 2500], d3.interpolateReds).clamp(true),
  tds: d3.scaleSequential([0, 800], d3.interpolatePuRd).clamp(true),
  temp: d3.scaleSequential([0, 35], interpolateBuYlRd).clamp(true),
  tss: d3.scaleSequential([0, 500], d3.interpolateRdPu).clamp(true),
  turbidity: d3.scaleSequential([0, 100], d3.interpolateInferno).clamp(true),
  wet: d3.scaleSequential([0, 1], d3.interpolateInferno).clamp(true),
  doPerc: d3.scaleSequential([0, 200], d3.interpolateBlues).clamp(true),
  chlorophyll: d3.scaleSequential([0, 200], d3.interpolateGreens).clamp(true),
}

export const units: SeriesNames = {
  bod: "mg/L",
  bodPercent: "%",
  chlorides: "mg/L",
  datainfo: "days ago",
  do: "mg/L",
  doContactTank: "mg/L",
  doOutfall: "mg/L",
  ecoli: "CFU",
  flow: "ft^3/s",
  height: "ft",
  nitrates: "mg/L",
  ph: "",
  phosphorus: "mg/L",
  spc: "uS/cm",
  tds: "mg/L",
  temp: "C",
  tss: "mg/L",
  turbidity: "NTU",
  doPerc: "%",
  chlorophyll: "ug L"
}

const numericFormats: SeriesNames = {
  ecoli: "%d",
  flow: "%d",
  nitrates: "%.2f",
  ph: "%.2f",
  phosphorus: "%.2f",
  spc: "%d",
  tds: "%d",
  turbidity: "%d",
  fishIbi: "%d",
  invertMacro: "%d",
  invertIndiana: "%d",
  invertMichigan: "%d",
  doPerc: "%.1f",
  chlorophyll: "%.1f",
}

export const categoryNames: SeriesCategoryNames = {
  wet: {
    "0": "Dry",
    "1": "Wet",
    undefined: "Unknown",
  },
}

export const categoryColors: SeriesCategoryNames = {
  wet: {
    "0": "fffd37.", // sunshine yellow
    "1": "002366", // royal blue
    undefined: "000000", // black
  },
}

export const radiusRange = [9, 20];

export function formatValue(series:string , value: number) {
  let fstr = numericFormats[series];
  if(!fstr) {
    fstr = "%.2f";
  }
  return sprintf(fstr, value);
}

export function formatValueMean(siteId: string, seriesId: string) {
  const series = model.getSeries(siteId, seriesId);
  const mean = series.mean();
  return formatValue(seriesId, mean)
}


export function labelWithUnits(series: string) {
  const l = labels[series] || '';
  const u = units[series] || '';

  return u.length > 0 ? l + ` (${u})` : l;
}

