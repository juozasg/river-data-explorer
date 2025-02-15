import * as aq from 'arquero';

import type { Site } from "$lib/types/site";
import { sitesTables } from "./data/datasets.svelte";
import { sitesGeoindex } from "./data/geoindexes.svelte";
import { enabledDatasets } from './ui/layers.svelte';
import { regionTypes, type RegionFeature } from './data/features.svelte';
import type ColumnTable from 'arquero/dist/types/table/column-table';

export class Sites {
	private sites: Site[] = $state([]);

	add(site: Site) {
		this.sites.push(site);
	}

	withDataTables(onlyEnabled = false) {
		// console.log('with data tables', sitesTables.size, this.sites.length)
		const keys = Array.from(sitesTables.keys());
		const sts = onlyEnabled ? this.allEnabled : this.all;
		return sts.filter(s => keys.includes(s.id));
	}

	static groupedBy(_sites: Site[], key: string, orderby: string = 'num') {
		if (!_sites || _sites.length < 1) return new Map();
		return aq.from(_sites).groupby(key).orderby(orderby).objects({ grouped: true }) as unknown as Map<string, Site[]>;
	}

	get allEnabled() {
		const datasets = enabledDatasets();
		// return this.sites.filter(s => s.id === 'sjrbc-20');
		return this.sites.filter(s => [...datasets].includes(s.dataset));
	}

	get all() {
		return this.sites;
	}

	get allDatasets(): string[] {
		return [...Sites.groupedBy(this.sites, 'dataset').keys()];
	}

	static forRegionFeature(sites: Site[], region?: RegionFeature) {
		if(!region) return [];
		const regionType = region.regionType; // for example: 'huc10'
		return sites.filter(s => (s as any)[regionType] === region.id);
	}

	findById(siteId: string) {
		return this.sites.find(s => s.id === siteId);
	}

	reindexGeometries() {
		for (const site of this.sites) {
			regionTypes.forEach((rt) => {
				(site[rt] as any) = sitesGeoindex[site.id]?.[rt] as string || '';
			});
		}
	}
}

export const sites = new Sites();

export const siteTablesForRegion = (sites: Site[], region: RegionFeature) => {
	const regionType = region.regionType;
	const regionSites = sites.filter(s => (s as any)[regionType] === region.id);
	return regionSites.map(s => sitesTables.get(s.id)).filter(t => t) as ColumnTable[];
}

export function splitSiteId(siteId: string): { dataset: string, num: number } {
	const [dataset, ns] = siteId.split('-');
	return { dataset, num: parseInt(ns) };
}


