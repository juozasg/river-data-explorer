import { toDate } from 'date-fns'

import { SvelteMap } from 'svelte/reactivity';
import * as aq from 'arquero';

import { loadDataCsv } from "$lib/data/cachedDataLoad";
import { startedLoading } from '../ui/loadingItem.svelte';
import { dataPathsStartingWith } from '$src/lib/data/loaders/loadAppData';
import type ColumnTable from 'arquero/dist/types/table/column-table';
import { variablesMetadata } from '$src/appstate/variablesMetadata.svelte';
import { sites } from '../sites.svelte';
import { parseUTC1700Date } from '$src/lib/utils/date';
import { defineGlobal } from '$src/lib/utils';

export type SiteId = string;
export const sitesTables: Map<SiteId, ColumnTable> = new SvelteMap();

export const totalRecords = () => [...sitesTables.values()].reduce((acc, tbl) => acc + tbl.numRows(), 0);


export async function loadDatasets() {
	type DatasetRecord = Record<string, any> & { date: Date } & { siteId: SiteId };
	const sitesRecords: Map<SiteId, DatasetRecord[]> = new Map();

	const finishedLoading = startedLoading("Datasets");

	const promises = dataPathsStartingWith('datasets/').map(async (path) => {
		return loadDataCsv(path);
	});

	const filesRecords = await Promise.all(promises);
	const records = filesRecords.flat();
	// console.log('sitesRecords loaded. records.length = ', records.length, 'record[0] = ', records[0])

	const validKeys = Object.keys(variablesMetadata);
	// console.log('known variables', validKeys);
	const futureDateMs = (new Date()).valueOf() + (1000 * 60 * 60 * 24 * 3); // 3 days from now
	for (const r of records) {
		r.siteId = r.siteId.trim();
		r.date = r.date.trim();
		// no siteTables with empty basic data will be produced
		if (!r.siteId || !r.date) {
			continue;
		}

		// if(r.siteId !== 'steuben-1') {
		// 	continue;
		// }

		const record: Record<string, any> = {};
		for (const key in r) {
			if (key == 'siteId') {
				continue;
			}

			if (validKeys.includes(key) || key == 'date') {
				record[key] = parseValue(key, r[key] as string);
			}
		}

		if(!record.date && isNaN(record.date.valueOf()) || record.date.valueOf() > futureDateMs) {
			// console.warn('Invalid date in csv files', r.date, r, record.date);
			continue
		}

		const siteRecords = sitesRecords.get(r.siteId) || [];
		siteRecords.push(record as DatasetRecord);
		sitesRecords.set(r.siteId, siteRecords);
	}

	sitesRecords.forEach((records, siteId) => {
		const tbl = aq.from(records).orderby('date').reify();
		sitesTables.set(siteId, tbl);
	});

	defineGlobal('aq', aq);
	defineGlobal('sites', sites);
	defineGlobal('sitesTables', sitesTables);

	finishedLoading();
}


function parseValue(key: string, value: string): number | Date | string | undefined {
	value = value.trim();
	if (key == 'date') {
		return parseUTC1700Date(value);
	}

	const isCategorical = !!(variablesMetadata[key]?.categories);
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


