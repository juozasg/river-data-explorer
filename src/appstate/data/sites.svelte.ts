import * as aq from 'arquero';

import type { Site } from "$lib/types/site";
import { _sitesTables } from "./datasets.svelte";
import { enabledDatasets } from '../ui/layers.svelte';
import type ColumnTable from 'arquero/dist/types/table/column-table';
import type { BasinObject, BasinObjectType } from './basinObject.svelte';
import { SvelteMap } from 'svelte/reactivity';

// ecoli-1 -> 10001
export const siteIds = new SvelteMap<string, number>();
export const sites = new SvelteMap<number, Site>();


export class Sites {
	#sites: Site[] = $state([]);

	add(site: Site) {
		this.#sites.push(site);
	}

	withDataTables(onlyEnabled = false) {
		// console.log('with data tables', sitesTables.size, this.#sites.length)
		const keys = Array.from(_sitesTables.keys());
		const sts = onlyEnabled ? this.allEnabled : this.all;
		return sts.filter(s => keys.includes(s.siteId));
	}

	static groupedBy(_sites: Site[], key: string, orderby: string = 'num') {
		if (!_sites || _sites.length < 1) return new Map();
		return aq.from(_sites).groupby(key).orderby(orderby).objects({ grouped: true }) as unknown as Map<string, Site[]>;
	}

	get allEnabled() {
		const datasets = enabledDatasets();
		// return this.#sites.filter(s => s.siteId === 'sjrbc-20');
		return this.#sites.filter(s => [...datasets].includes(s.dataset));
	}

	get all() {
		return this.#sites;
	}

	get allDatasets(): string[] {
		return [...Sites.groupedBy(this.#sites, 'dataset').keys()];
	}

	// static forRegionFeature(sites: Site[], region?: RegionFeature) {

	// }

	forBasinObject(object: BasinObject) {
		return this.forBasinObjectId(object.objectType, object.id);
	}

	forBasinObjectId(objectType?: BasinObjectType, id?: number) {
		if (!objectType || id === undefined) return [];
		// return this.#sites.filter(s => (s as any)[objectType] === id);
		// TODO: implement this properly
		return [];
	}

	findBySiteId(siteId: string) {
		return this.#sites.find(s => s.siteId === siteId);
	}

	findById(id: number) {
		return this.#sites.find(s => s.id === id);
	}


	reindexGeometries() {
		// TODO: implement this properly
		// 		for (const site of this.#sites) {
		// 			regionTypes.forEach((rt) => {
		// 				if (rt !== 'custom') {
		// 					(site[rt] as any) = sitesGeoindex[site.siteId]?.[rt] as string || '';
		// 				}
		// 			});
		// 		}
	}
}

export const _sites = new Sites();

// export const siteTablesForRegion = (sites: Site[], region: RegionFeature) => {
// 	const regionType = region.regionType;
// 	const regionSites = sites.filter(s => (s as any)[regionType] === region.id);
// 	return regionSites.map(s => sitesTables.get(s.siteId)).filter(t => t) as ColumnTable[];
// }

export function splitSiteId(siteId: string): { dataset: string, num: number } {
	const [dataset, ns] = siteId.split('-');
	return { dataset, num: parseInt(ns) };
}


