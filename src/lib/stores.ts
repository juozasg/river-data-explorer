import type { Numeric } from 'd3';
import { writable, derived, get } from 'svelte/store';

import { model } from "./data/model"
import { scales, radiusRange } from "./definitions"

import * as d3 from "d3";


export const showDataSelector = writable(true);
export const showTimeseries = writable(false);
export const showDataTable = writable(false);

export const dataLoaded = writable(false);

export const selectedSeries = writable('datainfo');
export const selectedSites = writable([] as string[]);



export type Site = {
  id: string,
  dataset: string,
  name: string,
  lat: number,
  lon: number,
  observationFrequency: string,
  observationDaysSinceLast: number, 

}

// just use model.getValue for now
// export const sitesMapData = writable({'siteid': {'datainfo': 0, 'temp': 23} })

export const sites = writable([] as Site[]);

export function getSite(siteId) {
  return get(sites).find(site => site.id === siteId);
}


export function getSiteRadius(siteId, seriesId) {
  const value = model.getValue(siteId, seriesId);
  const colorScale = scales[seriesId];
  const radiusScale = colorScale.copy().range(radiusRange);
  return radiusScale(value);
}

export function getSiteColor(siteId, seriesId) {
  const value = model.getValue(siteId, seriesId);
  const colorScale = scales[seriesId];
  return d3.color(colorScale(value)).formatHex();
}



// export const siteSymbols = derived([sites, selectedSeries], ([$sites, $seriesId]) => {
//   $sites.map(site => {
//     const value = model.getValue(site.id, $seriesId);
//     const colorScale = scales[$seriesId];
//     const radiusScale = colorScale.copy().range(radiusRange);

//     return {
//       color: d3.color(colorScale(value)).formatHex(),
//       radius: radiusScale(value)
//     };
//   });
// });

// export function getSiteSymbol(siteId) {
//   return get(siteSymbols).find(site => site.id === siteId);
// }



// sites.set([{
//   id: 'site01',
//   name: "Site 1",
//   lat: 41.55,
//   lon: -85.8
// }]);




export const viewportWidth = writable(window.innerWidth);
export const viewportHeight = writable(window.innerHeight);

window.addEventListener('resize', () => {
  viewportWidth.set(window.innerWidth);
  viewportHeight.set(window.innerHeight);
});