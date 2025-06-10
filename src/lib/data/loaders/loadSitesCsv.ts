import { loadDataCsv } from "$lib/data/cachedDataLoad";
import { dataPathsStartingWith } from "$lib/data/loaders/loadAppData";
import type { Site } from "$lib/types/site";
import { siteIds, sites, splitSiteId } from "$src/appstate/data/sites.svelte";
import { startedLoading } from "../../../appstate/ui/loadingItem.svelte";


export async function loadSitesCsv(datasetIds: Map<string, number>) {
	const finishedLoading = startedLoading("Sites");

	const promises = dataPathsStartingWith('sites/').map(async (path) => {
		return loadDataCsv(path);
	});

	const filesRecords = await Promise.all(promises);
	const records = filesRecords.flat();

	for (const r of records) {
		// console.log('site', r);
		const dataset = splitSiteId(r.siteId).dataset;
		const num = splitSiteId(r.siteId).num;
		const intId = datasetIds.get(dataset)! + num;
		const site: Site = {
			siteId: r.siteId.trim(),
			id: intId,
			dataset,
			num,
			name: r.name,
			lat: parseFloat(r.lat),
			lon: parseFloat(r.lon),

			// calculated when everything is loaded
			// state: StateFips.UnknownState,
			// county: StateCountyFips.UnknownCounty,
			// huc8: '',
			// huc10: '',
			// huc12: '',
		};

		// if(r.siteId !== 'invert-436') {
		// 	continue;
		// }

		siteIds.set(site.siteId, site.id);
		sites.set(site.id, site);
	}

	finishedLoading();
}
