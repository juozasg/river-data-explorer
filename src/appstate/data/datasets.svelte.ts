import * as sr from 'svelte/reactivity';
import * as aq from 'arquero';

import { loadDataCsv } from "$lib/data/cachedDataLoad";
import { startedLoading } from '../ui/loadingItem.svelte';
import { dataPathsStartingWith } from '$src/lib/data/loaders/loadAppData';
import type ColumnTable from 'arquero/dist/types/table/column-table';
import { variableMetadata } from '$src/appstate/variableMetadata';

export type SiteId = string;
export const sitesTables: Map<SiteId, ColumnTable> = new sr.Map();


export async function loadDatasets() {
	type DatasetRecord = Record<string, any> & { date: Date } & { siteId: SiteId };
	const sitesRecords: Map<SiteId, DatasetRecord[]> = new Map();

	const finishedLoading = startedLoading("Datasets");

	const promises = dataPathsStartingWith('datasets/').map(async (path) => {
		return loadDataCsv(path);
	});

	const filesRecords = await Promise.all(promises);
	const records = filesRecords.flat();
	console.log('sitesRecords loaded. records.length = ', records.length, 'record[0] = ', records[0])

	const validKeys = Object.keys(variableMetadata);
	console.log('known variables', validKeys);
	for (const r of records) {
		r.siteId = r.siteId.trim();
		r.date = r.date.trim();
		// no siteTables with empty basic data will be produced
		if (!r.siteId || !r.date) {
			continue;
		}
		const record: Record<string, any> = {};
		for (const key in r) {
			if (key == 'siteId') {
				continue;
			}

			if (validKeys.includes(key) || key == 'date') {
				record[key] = parseValue(key, r[key] as string);
			}
		}

		const siteRecords = sitesRecords.get(r.siteId) || [];
		siteRecords.push(record as DatasetRecord);
		sitesRecords.set(r.siteId, siteRecords);
	}

	sitesRecords.forEach((records, siteId) => {
		const tbl = aq.from(records).orderby('date').reify();
		sitesTables.set(siteId, tbl);
	});

	(window as any)['aq'] = aq;
	(window as any)['tables'] = sitesTables;
	console.log('window.aq', aq);
	console.log('window.tables', sitesTables);

	// multi site stats same as this but s1tbl.concat(s2tbl).orderby('date') -- for all sites using reduce
	finishedLoading();
}


function parseValue(key: string, value: string): number | Date | string | undefined {
	value = value.trim();
	if (key == 'date') {
		return new Date(value);
	}

	const isCategorical = !!(variableMetadata[key]?.categories);
	if (isCategorical) {
		return value;
	}

	const num = parseFloat(value);
	if (isNaN(num)) {
		return undefined;
	} else {
		return num;
	}
}


