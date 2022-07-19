import type { Numeric } from 'd3';
import { writable, get } from 'svelte/store';


export const showDataSelector = writable(true);
export const showTimeseries = writable(false);
export const showDataTable = writable(false);

export const dataLoaded = writable(false);


export type Site = {
  id: string,
  name: string,
  lat: number,
  lon: number,
  observationFrequency: string,
  observationDaysSinceLast: number, 
}

export const sites = writable([] as Site[]);

export function getSite(siteId) {
  return get(sites).find(site => site.id === siteId);
}

// sites.set([{
//   id: 'site01',
//   name: "Site 1",
//   lat: 41.55,
//   lon: -85.8
// }]);


export const selectedSeries = writable('datainfo');
export const selectedSites = writable(['site01']);


export const viewportWidth = writable(window.innerWidth);
export const viewportHeight = writable(window.innerHeight);

window.addEventListener('resize', () => {
  viewportWidth.set(window.innerWidth);
  viewportHeight.set(window.innerHeight);
});