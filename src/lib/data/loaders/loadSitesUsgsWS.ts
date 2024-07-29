import { startedLoading } from "$src/appstate/ui/loadingItem.svelte";
import { sites } from "$src/appstate/sites.svelte";
import { notify } from "$src/appstate/ui/notifications.svelte";
import type { Site } from "$src/lib/types/site";
import { StateFips, StateCountyFips } from "$src/lib/types/fips";

export const usgsStationIds = '04096405,04096515,04097500,040975299,04097540,04099000,04100500,04101000,04101500,04101535,04101800,04102500,04099750';


export async function loadSitesUsgsWS() {
	// const finishedLoading = startedLoading("USGS Sites");
	// const url = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${usgsStationIds}&siteStatus=all`;

	// try {
	// 	const response = await fetch(url);
	// 	const usgsSites = await response.json();
	// 	// console.log('USGS sites', usgsSites);
	// 	usgsTimeseriesToSites(usgsSites.value.timeSeries);
	// } catch (error) {
	// 	console.error('Error loading USGS sites', error);
	// 	notify(`Error loading USGS sites ${url}`, 'error', 6000);
	// } finally {
	// 	finishedLoading();
	// 	sites.reindexGeometries();
	// }
}


function usgsTimeseriesToSites(timeSeries: any) {
	for(const ts of timeSeries) {
		const siteCode = ts.sourceInfo.siteCode[0].value;
		const siteId = `usgs-${siteCode}`;

		if(sites.findById(siteId)) continue;

		const loc = ts.sourceInfo.geoLocation.geogLocation;
		const site: Site = {
			id: siteId,
			dataset: 'usgs',
			name: ts.sourceInfo.siteName,
			lat: parseFloat(loc.latitude),
			lon: parseFloat(loc.longitude),

			// calculated when everything is loaded
			state: StateFips.UnknownState,
			county: StateCountyFips.UnknownCounty,
			huc10: '',
			huc12: '',
		};

		sites.add(site);
	}
	// console.log('sites including USGS', [...sites.all.map(s => s.id)]);
}
