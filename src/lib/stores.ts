import { writable } from 'svelte/store';

export const showDataSelector = writable(true);

export const selectedSeries = writable('datainfo');
export const selectedSites = writable([]);