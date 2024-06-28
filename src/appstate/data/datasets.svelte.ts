import * as sr from 'svelte/reactivity';

import { loadDataCsv } from "$lib/data/cachedDataLoad";
import { startedLoading } from '../ui/loadingItem.svelte';
import { dataPathsStartingWith } from '$src/lib/data/loaders/loadAppData';

// siteId -> timeseries records
export type SiteId = string;
export type DatasetRecord = Record<string, any> & { date: Date } & { siteId: SiteId };
export const sitesRecords: Map<SiteId, DatasetRecord[]> = new sr.Map();

export async function loadDatasets() {
	const finishedLoading = startedLoading("Datasets");

	const promises = dataPathsStartingWith('datasets/').map(async (path) => {
		return loadDataCsv(path);
	});

	const filesRecords = await Promise.all(promises);
	const records = filesRecords.flat();
	console.log('sitesRecords loaded. records.length = ',records.length, 'record[0] = ', records[0])

	for (const r of records) {
		const record: Record<string, any> = {};
		for(const key in r) {
			if(key == 'siteId') {
				continue;
			}
			if(key == 'date') {
				record['date'] = new Date(r[key] as string);
			} else {
				record[key] = parseFloat(r[key]);
			}
		}

		const siteRecords = sitesRecords.get(r.siteId) || [];
		siteRecords.push(record as DatasetRecord);
		sitesRecords.set(r.siteId, siteRecords);
	}

	sitesRecords.forEach((records, siteId) => {
		records.sort((a, b) => a.date.getTime() - b.date.getTime());
		sitesRecords.set(siteId, records);
	});

	console.log('completed records. sjrbc-1 = ', sitesRecords.get('sjrbc-1'));
	finishedLoading();
}

export type VariableName = string;
export type TimeseriesPoint = [Date, number];
export type Timeseries = [TimeseriesPoint]

export function recordsToTimeseries(records: DatasetRecord[]): Record<VariableName, Timeseries>{
	const timeseries: {[key: VariableName]: Timeseries} = {};
	records.forEach(r => {
		for(const key in r) {
			if(key == 'date' || key == 'siteId') {
				continue;
			}
			const series = timeseries[key] || [];
			if(!isNaN(r[key])) series.push([r.date, r[key]]); // NaN is baad
			timeseries[key] = series;
		}
	});

	// sort by date
	Object.keys(timeseries).forEach(key => {
		const series = timeseries[key];
		series.sort((a, b) => a[0].getTime() - b[0].getTime());
		if(series.length > 0) {
			timeseries[key] = series;
		} else {
			delete timeseries[key];
		}
	});

	console.log(timeseries)
	return timeseries;


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
}