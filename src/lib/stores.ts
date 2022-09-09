import { writable, get, Writable } from 'svelte/store';

export * from './stores/selectedSites';
export * from './stores/sites';
export * from './stores/viewport';

export const showDataSelector = writable(true);
export const showTimeseries = writable(true);
export const showDataTable = writable(false);

export const selectedSeries = writable('datainfo');

// export const leftSites = writable(new Set<string>(['usgs-04099750']));
export const leftSites = writable(new Set<string>());
export const leftSeries = writable('datainfo');

export const rightSites = writable(new Set<string>());
export const rightSeries = writable('datainfo');

export const mapStore: Writable<L.Map> = writable();
