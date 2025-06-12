import { startedLoading } from "../ui/loadingItem.svelte";
import type { Site } from "$src/lib/types/site";
import { SvelteMap } from "svelte/reactivity";
import type { BasinObjectType } from "./basinObject.svelte";
import { sites } from "./sites.svelte";
import { loadDataJson } from "$src/lib/data/cachedDataLoad";
import { load } from "js-yaml";
import { defineGlobal } from "$src/lib/utils";


export type BasinRegionType =  Exclude<BasinObjectType, 'site'>;

export type SiteIntId = number;

export type GeoindexRegion = {
	objectType: BasinRegionType;
	id: number;
}

// export const siteRegionsGeoindex = new SvelteMap<SiteIntId, GeoindexRegion[]>();
export const regionsSitesGeoindex: Record<BasinRegionType, SvelteMap<number, SiteIntId[]>> = {
	huc8: new SvelteMap<number, SiteIntId[]> (),
	huc10: new SvelteMap<number, SiteIntId[]>(),
	huc12: new SvelteMap<number, SiteIntId[]>(),
	state: new SvelteMap<number, SiteIntId[]>(),
	county: new SvelteMap<number, SiteIntId[]>(),
	'river-catchment': new SvelteMap<number, SiteIntId[]>(),
	'site-catchment': new SvelteMap<number, SiteIntId[]>(),
}


export function sitesInRegion(regionType: BasinRegionType, regionId: number): Site[] {
	const ids = regionsSitesGeoindex[regionType].get(regionId) || [];
	return ids.map(id => sites.get(id)).filter((site): site is Site => !!site);
}



export async function loadGeoindexes() {
	const regionTypes = Object.keys(regionsSitesGeoindex) as BasinRegionType[];
	const promises = regionTypes.map(loadGeoindexData);
	await Promise.all(promises);

	defineGlobal('regionsSitesGeoindex', regionsSitesGeoindex);
	defineGlobal('sitesInRegion', sitesInRegion);
}



async function loadGeoindexData(name: BasinRegionType) {
	const path = `indexes/${name}.json`;
	try {
		const data = await loadDataJson(path);
		for(let featureId in data) {
			const siteIds = data[featureId] as SiteIntId[];
			const id = parseInt(featureId);
			regionsSitesGeoindex[name].set(id, siteIds);
		}


		console.log('loaded', path);
	} catch (e) {
		console.error('Error loading geoindex', path, e);
	}
}