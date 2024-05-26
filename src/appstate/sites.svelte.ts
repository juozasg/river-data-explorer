import { loadDataCsv } from "$lib/data/cachedDataLoad";
import { dataPathsStartingWith } from "$lib/data/loadAppData";
import type { Site } from "$lib/types/site";
import { CountyFips, StateFips } from "$src/lib/types/fips";
import { startedLoading } from "./ui/loadingItem.svelte";

export class Sites {
	sites: Site[] = $state([]);
	selectedSites: Site[] = $state([]);

	add(site: Site) {
		this.sites.push(site);
	}

	get all() {
		return this.sites;
	}

	get selected() {
		return this.selectedSites;
	}
}

export const sites = new Sites();


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
			county: CountyFips.UnknownCounty,
			huc10: '1122334455',
			huc12: '112233445566',
		}

		sites.add(site);
	}

	finishedLoading();
}

function splitSiteId(siteId: string): { dataset: string, num: number } {
	const [dataset, ns] = siteId.split('-');
	return {dataset, num: parseInt(ns) };
}
