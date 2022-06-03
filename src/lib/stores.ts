import { writable } from 'svelte/store';

export const showDataSelector = writable(true);

export const dataVariable = writable('datainfo');