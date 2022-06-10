import { writable } from 'svelte/store';

export const showDataSelector = writable(true);
export const showTimeseries = writable(false);
export const showDataTable = writable(false);

export const selectedSeries = writable('datainfo');
export const selectedSites = writable([]);

export const viewportWidth = writable(window.innerWidth);
export const viewportHeight = writable(window.innerHeight);

window.addEventListener('resize', () => {
  viewportWidth.set(window.innerWidth);
  viewportHeight.set(window.innerHeight);
});