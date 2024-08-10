import * as aq from 'arquero';

import type { Site } from "$lib/types/site";
import { sitesTables } from "./data/datasets.svelte";
import { sitesGeoindex } from "./data/geoindexes.svelte";
import { enabledDatasets } from './ui/layers.svelte';

export class Sites {
	private sites: Site[] = $state([]);

	add(site: Site) {
		this.sites.push(site);
	}

	withDataTables() {
		console.log('with data tables', sitesTables.size, this.sites.length)
		const keys = Array.from(sitesTables.keys());
		return sites.allEnabled.filter(s => keys.includes(s.id));
	}

	static groupedBy(_sites: Site[], key: string, orderby: string = 'num') {
		if (!_sites || _sites.length < 1) return new Map();
		return aq.from(_sites).groupby(key).orderby(orderby).objects({ grouped: true }) as unknown as Map<string, Site[]>;
	}

	get allEnabled() {
		const datasets = enabledDatasets();
		return this.sites.filter(s => datasets.includes(s.dataset));
	}

	get all() {
		return this.sites;
	}




	get allDatasets(): string[] {
		return [...Sites.groupedBy(this.sites, 'dataset').keys()];
	}

	inHuc10(huc10: string | undefined | number) {
		return this.sites.filter(s => s.huc10 === huc10);
	}

	findById(siteId: string) {
		return this.sites.find(s => s.id === siteId);
	}

	reindexGeometries() {
		for (const site of this.sites) {
			if (!site.huc10) {
				site.huc10 = sitesGeoindex[site.id]?.huc10 || '';
				// console.log('set index', site.id, site.huc10);
			}
		}
	}
}

export const sites = new Sites();

export function splitSiteId(siteId: string): { dataset: string, num: number } {
	const [dataset, ns] = siteId.split('-');
	return { dataset, num: parseInt(ns) };
}


