import * as sr from 'svelte/reactivity';

import { loadDataCsv } from "$lib/data/cachedDataLoad";
import { startedLoading } from '../ui/loadingItem.svelte';
import { dataPathsStartingWith } from '$src/lib/data/loaders/loadAppData';

export const datasets: Map<string, Record<string, any>[]> = new sr.Map();

export async function loadDatasets() {
	const finishedLoading = startedLoading("Datasets");

	const promises = dataPathsStartingWith('datasets/').map(async (path) => {
		return loadDataCsv(path);
	});

	const filesRecords = await Promise.all(promises);
	const records = filesRecords.flat();
	console.log('datasets', records.length, records[0])

	for (const r of records) {
		const record: Record<string, any> = {};
		for(const key in r) {
			if(key == 'siteId') {
				continue;
			}
			if(key == 'date') {
				record[key] = new Date(r[key] as string);
			} else {
				record[key] = parseFloat(r[key]);
			}
		}

		const siteRecords = datasets.get(r.siteId) || [];
		siteRecords.push(record);
		datasets.set(r.siteId, siteRecords);
	}

	datasets.forEach((records, siteId) => {
		records.sort((a, b) => a.date - b.date);
		datasets.set(siteId, records);
	});

	console.log('completed records', datasets.get('sjrbc-1'));
	finishedLoading();
}
