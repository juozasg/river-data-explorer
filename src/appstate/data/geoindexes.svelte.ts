import { startedLoading } from "../ui/loadingItem.svelte";
import { loadDataCsv } from "$src/lib/data/cachedDataLoad";
// import { regionTypes, type RegionType } from "./_regionFeatures.svelte";
import { defineGlobal } from "$src/lib/utils";
import type { BasinObject, BasinObjectType } from "./basinObject.svelte";
import { SvelteMap } from "svelte/reactivity";
import type { Site } from "$src/lib/types/site";
import { sites } from "./sites.svelte";


export type BasinRegionType =  Exclude<BasinObjectType, 'site'>;

export type SiteIntId = number;

export type GeoindexRegion = {
	objectType: BasinRegionType;
	id: number;
}

export const siteRegionsGeoindex = new SvelteMap<SiteIntId, GeoindexRegion[]>();
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



export async function loadGeoindexData() {
	const finishedLoading = startedLoading("Geodata Indexes");

	// TODO: geoindex
	console.warn('TODO: geoindex loading');

	const path = 'indexes/sites.csv';
	// const sitesRows = await loadDataCsv(path);
	// sitesRows.forEach((row) => {
	// 	const key = row.siteId as string;
	// 	const regionsIndex: RegionsIndex = {} as RegionsIndex;
	// 	regionTypes.forEach((rt) => {
	// 		regionsIndex[rt] = row[rt] as string;
	// 	});

	// 	sitesGeoindex[key] = regionsIndex;
	// });

	// finishedLoading();
	// defineGlobal('sitesGeoindex', sitesGeoindex);
	// sites.reindexGeometries();
}