import { startedLoading } from "../ui/loadingItem.svelte";
import { loadDataCsv } from "$src/lib/data/cachedDataLoad";
import { sites } from "../sites.svelte";
import { regionTypes, type RegionType } from "./features.svelte";

export type RegionsIndex = {[key in RegionType]: string };
export const sitesGeoindex: { [key: string]: RegionsIndex} = {};

export async function loadGeoindexData() {
	const finishedLoading = startedLoading("Geodata Indexes");

	const path = 'indexes/sites.csv';
	const sitesRows = await loadDataCsv(path);
	sitesRows.forEach((row) => {
		const key = row.siteId as string;
		const regionsIndex: RegionsIndex = {} as RegionsIndex;
		regionTypes.forEach((rt) => {
			regionsIndex[rt] = row[rt] as string;
		});

		sitesGeoindex[key] = regionsIndex;
	});

	finishedLoading();
	console.log('loaded sitesGeoindex', sitesGeoindex);
	sites.reindexGeometries();
}