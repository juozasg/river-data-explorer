import { loadDataCsv } from "$lib/data/cachedDataLoad";
import { dataPathsStartingWith } from "$lib/data/loaders/loadAppData";
import type { Site } from "$lib/types/site";
import { StateCountyFips, StateFips } from "$src/lib/types/fips";
import { startedLoading } from "../../../appstate/ui/loadingItem.svelte";
import { splitSiteId, sites } from "../../../appstate/sites.svelte";



export async function loadSitesCsv() {
	const finishedLoading = startedLoading("Sites");

	const promises = dataPathsStartingWith('sites/').map(async (path) => {
		return loadDataCsv(path);
	});

	const filesRecords = await Promise.all(promises);
	const records = filesRecords.flat();

	for (const r of records) {
		// console.log('site', r);
		const site: Site = {
			id: r.siteId,
			dataset: splitSiteId(r.siteId).dataset,
			name: r.name,
			lat: parseFloat(r.lat),
			lon: parseFloat(r.lon),

			// calculated when everything is loaded
			state: StateFips.UnknownState,
			county: StateCountyFips.UnknownCounty,
			huc10: '',
			huc12: '',
		};

		sites.add(site);
	}

	sites.reindexGeometries();

	finishedLoading();
}
