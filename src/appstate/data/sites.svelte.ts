
import { SvelteMap, SvelteSet } from 'svelte/reactivity';
import type { Site } from "$lib/types/site";

// ecoli-1 -> 10001
export const siteIds = new SvelteMap<string, number>();
export const sites = new SvelteMap<number, Site>();

export const rtSiteIds = new SvelteSet<string>();