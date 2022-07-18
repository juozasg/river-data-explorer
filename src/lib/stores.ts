import { writable } from 'svelte/store';

export const showDataSelector = writable(true);
export const showTimeseries = writable(false);
export const showDataTable = writable(false);

export const sites = writable({});
sites.set({'site01': [41.55,-85.8]})


export const selectedSeries = writable('datainfo');
export const selectedSites = writable(['site01']);


export const viewportWidth = writable(window.innerWidth);
export const viewportHeight = writable(window.innerHeight);

window.addEventListener('resize', () => {
  viewportWidth.set(window.innerWidth);
  viewportHeight.set(window.innerHeight);
});