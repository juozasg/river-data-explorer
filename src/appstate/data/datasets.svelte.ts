import * as sr from 'svelte/reactivity';
import  * as aq from 'arquero';

import { loadDataCsv } from "$lib/data/cachedDataLoad";
import { startedLoading } from '../ui/loadingItem.svelte';
import { dataPathsStartingWith } from '$src/lib/data/loaders/loadAppData';
import type ColumnTable from 'arquero/dist/types/table/column-table';
import type { VariableMetadata } from '$src/lib/types/variableMetadata';

export type SiteId = string;
export const sitesTables: Map<SiteId, ColumnTable> = new sr.Map();

export async function loadDatasets(variableMetadata: VariableMetadata) {
	type DatasetRecord = Record<string, any> & { date: Date } & { siteId: SiteId };
	const sitesRecords: Map<SiteId, DatasetRecord[]> = new Map();

	const finishedLoading = startedLoading("Datasets");

	const promises = dataPathsStartingWith('datasets/').map(async (path) => {
		return loadDataCsv(path);
	});

	const filesRecords = await Promise.all(promises);
	const records = filesRecords.flat();
	console.log('sitesRecords loaded. records.length = ', records.length, 'record[0] = ', records[0])

	for (const r of records) {
		const record: Record<string, any> = {};
		for(const key in r) {
			if(key == 'siteId') {
				continue;
			}

			record[key] = parseValue(key, r[key] as string);
		}

		const siteRecords = sitesRecords.get(r.siteId) || [];
		siteRecords.push(record as DatasetRecord);
		sitesRecords.set(r.siteId, siteRecords);
	}

	sitesRecords.forEach((records, siteId) => {
		// records.sort((a, b) => a.date.getTime() - b.date.getTime());
		// sitesRecords.set(siteId, records);
		const tbl = aq.from(records).orderby('date').reify();
		sitesTables.set(siteId, tbl);
	});

	console.log('completed records. sjrbc-1 = ', sitesRecords.get('sjrbc-1'));
	console.log('sjrbc-1 row 0 =', sitesTables.get('sjrbc-1')?.object(0));
	// sitesTables.get('sjrbc-1')!.print();

	(window as any)['aq'] = aq;
	(window as any)['tables'] = sitesTables;
	console.log('window.aq', aq);
	console.log('window.tables', sitesTables);

	// multi site stats same as this but s1tbl.concat(s2tbl).orderby('date') -- for all sites using reduce
	finishedLoading();
}


function parseValue(key: string, value: string): number | Date | string  {
	if(key == 'date') {
		return new Date(value);
	} else if(key == 'invertNarrative') {
		return value;
	} else {
		return parseFloat(value);
	}
	// TODO: don't parse floats for variables which have 'categories'
}



// export type VariableName = string;
// export type TimeseriesPoint = [Date, number];
// export type Timeseries = [TimeseriesPoint]
// export type TimeseriesMap = Record<VariableName, Timeseries>;

// export const sitesTimeseries: Map<SiteId, TimeseriesMap> = new sr.Map();

// export function recordsToTimeseries(records: DatasetRecord[]): TimeseriesMap {
// 	const timeseries: {[key: VariableName]: Timeseries} = {};
// 	records.forEach(r => {
// 		for(const key in r) {
// 			if(key == 'date' || key == 'siteId') {
// 				continue;
// 			}
// 			const series = timeseries[key] || [];
// 			if(!isNaN(r[key])) series.push([r.date, r[key]]); // NaN is baad
// 			timeseries[key] = series;
// 		}
// 	});

// 	// sort by date
// 	Object.keys(timeseries).forEach(key => {
// 		const series = timeseries[key];
// 		series.sort((a, b) => a[0].getTime() - b[0].getTime());
// 		if(series.length > 0) {
// 			timeseries[key] = series;
// 		} else {
// 			delete timeseries[key];
// 		}
// 	});

// 	console.log(timeseries)
// 	return timeseries;


	// const dates = records.map(r => r.date);
	// const values = records.map(r => {
	// 	const values = [];
	// 	for(const key in r) {
	// 		if(key == 'date' || key == 'siteId') {
	// 			continue;
	// 		}
	// 		values.push(r[key]);
	// 	}
	// 	return values;
	// });
	// return [dates, values];
// }