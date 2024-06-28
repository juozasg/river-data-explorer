import type { SitesDataStats } from "$lib/types/analysis";
import type { Site } from "$lib/types/site";
import { datasets, type DatasetRecord } from "$src/appstate/data/datasets.svelte";
import { fmtDate } from "$lib/utils";

function siteRecords(site: Site): DatasetRecord[] {
	return datasets.get(site.id) || [];
}

export function sitesDataStats(sites: Site[]): SitesDataStats {
	const numSites = sites.length;
	const numVariables = sites.reduce((acc, site) => {
		const records = siteRecords(site)
		const numVars = Object.keys(records[0] || {}).length - 1; // remove 'date'
		return Math.max(acc, numVars);
	}, 0);
	const numRecords = sites.reduce((acc, site) => acc + siteRecords(site).length, 0);
	const dates = sites.flatMap(site => siteRecords(site).map(r => r.date));

	// sites.forEach(site => {
	// 	console.log(site, siteRecords(site));
	// });

	let dateFromLabel;
	let dateToLabel;
	if(dates.length > 0) {
		const dateFrom = new Date(Math.min(...dates.map(d => d.getTime())));
		const dateTo = new Date(Math.max(...dates.map(d => d.getTime())));
		dateFromLabel = fmtDate(dateFrom);
		dateToLabel = fmtDate(dateTo);
	}

	return {
		numSites,
		numVariables,
		numRecords,
		dateFromLabel,
		dateToLabel,
	};
}


// let _varsNumber = 0;
// let _recordsNumber = 0;

// for (const s of sites) {
// 	const records = datasets.get(s.id);
// 	_recordsNumber += records?.length || 0;

// 	const firstRecord = records?.[0] || {};
// 	_varsNumber = Math.max(_varsNumber, Object.keys(firstRecord).length);

// 	const lastRecord = records?.[records.length - 1] || {};

// 	const firstDate = firstRecord.date;
// 	const lastDate = firstRecord.date;

// 	if(firstDate) {
// 		if(!firstObs) firstObs = firstDate;

// 		if(firstDate < firstObs!) {
// 			firstObs = firstDate;
// 		}
// 	}

// 	if(lastDate) {
// 		if(!lastObs) lastObs = lastDate;

// 		if(lastDate > lastObs!) {
// 			lastObs = lastDate;
// 		}
// 	}
// }

// varsNumber = _varsNumber > 0 ? _varsNumber - 1 : 0; // remove 'date' column
// recordsNumber = _recordsNumber;