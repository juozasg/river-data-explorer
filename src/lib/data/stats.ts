import  * as aq from 'arquero';
import type { SitesDataStats, VariableStats } from "$lib/types/analysis";
import type { Site } from "$lib/types/site";
// import { sitesRecords, type DatasetRecord, type Timeseries } from "$src/appstate/data/datasets.svelte";
import { fmtDate } from "$lib/utils";
import { dataVariables } from "./loaders/loadAppData";



import type ColumnTable from 'arquero/dist/types/table/column-table';


export function columnMeans(table: ColumnTable): any {
	const cols = table.columnNames() || [];
	const colMeanOps = cols.reduce((a:any, v: any) => {a[v] = aq.op.mean(v); return a}	, {});
	console.log('colMeanOps', colMeanOps)
	const means = table.rollup(colMeanOps).object();
	console.log('means', means)

	return means;
}

// export function siteRecords(site: Site): DatasetRecord[] {
// 	return sitesRecords.get(site.id) || [];
// }

// export function sitesDataStats(sites: Site[]): SitesDataStats {
// 	const numSites = sites.length;
// 	const numVariables = sites.reduce((acc, site) => {
// 		const records = siteRecords(site)
// 		const numVars = Object.keys(records[0] || {}).length - 1; // remove 'date'
// 		return Math.max(acc, numVars);
// 	}, 0);
// 	const numRecords = sites.reduce((acc, site) => acc + siteRecords(site).length, 0);
// 	const dates = sites.flatMap(site => siteRecords(site).map(r => r.date));

// 	// sites.forEach(site => {
// 	// 	console.log(site, siteRecords(site));
// 	// });

// 	let dateFromLabel;
// 	let dateToLabel;
// 	if(dates.length > 0) {
// 		const dateFrom = new Date(Math.min(...dates.map(d => d.getTime())));
// 		const dateTo = new Date(Math.max(...dates.map(d => d.getTime())));
// 		dateFromLabel = fmtDate(dateFrom);
// 		dateToLabel = fmtDate(dateTo);
// 	}

// 	return {
// 		numSites,
// 		numVariables,
// 		numRecords,
// 		dateFromLabel,
// 		dateToLabel,
// 	};
// }


// export function timeseriesToStats(variable: string, ts: Timeseries): VariableStats {
// 	const label = variablesMetadata.labels[variable] || variable;
// 	const numObservations = ts.length;
// 	const lastObservation = ts[numObservations - 1][1];
// 	const values = ts.map(p => p[1]);
// 	const min = Math.min(...values);
// 	const max = Math.max(...values);
// 	const mean = values.reduce((acc, v) => acc + v, 0) / numObservations;
// 	const sortedValues = values.sort((a, b) => a - b);
// 	const median = sortedValues[Math.floor(numObservations / 2)];
// 	const sum = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0);
// 	const stdDev = Math.sqrt(sum / numObservations);
// 	const dateFromLabel = fmtDate(ts[0][0]);
// 	const dateToLabel = fmtDate(ts[numObservations - 1][0]);

// 	return {
// 		variable,
// 		label,
// 		lastObservation,
// 		numObservations,
// 		min,
// 		max,
// 		mean,
// 		median,
// 		stdDev,
// 		dateFromLabel,
// 		dateToLabel,
// 	};

// }
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