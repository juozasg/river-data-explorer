import { startedLoading } from "../ui/loadingItem.svelte";
import { loadDataCsv } from "$src/lib/data/cachedDataLoad";
import { sites } from "../sites.svelte";

export const sitesGeoindex: { [key: string]: {huc10: string }} = {};

export async function loadBasinFipsData() {
	const finishedLoading = startedLoading("Geodata Indexes");

	const path = 'indexes/sites.csv';
	const sitesRows = await loadDataCsv(path);
	sitesRows.forEach((row) => {
		const key = row.siteId as string;
		sitesGeoindex[key] = {huc10: row.huc10 as string};
		// sitesGeoindex[row.siteId as string] = {huc10: row.huc10 as string};
	});

	finishedLoading();
	sites.reindexGeometries();
}