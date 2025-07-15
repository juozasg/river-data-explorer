import { toDate } from 'date-fns'

import { SvelteMap } from 'svelte/reactivity';
import * as aq from 'arquero';

import { loadDataCsv } from "$lib/data/cachedDataLoad";
import { startedLoading } from '../ui/loadingItem.svelte';
import { dataPathsStartingWith } from '$src/lib/data/loaders/loadAppData';
import type ColumnTable from 'arquero/dist/types/table/column-table';
import { variablesMetadata, varnames } from '$src/appstate/variablesMetadata.svelte';
import { siteIds, sites } from './sites.svelte';
import { parseUTC1700Date } from '$src/lib/utils/date';
import { defineGlobal } from '$src/lib/utils';
import type { Site, SiteId } from '$src/lib/types/site';
import { untrack } from 'svelte';

export const siteDatasets = new SvelteMap<number, ColumnTable>();
export const siteRealtimeDatasets = new SvelteMap<number, ColumnTable>();

export function sitesDatasets(sites: Site[]): ColumnTable[] {
	return sites.map(site => siteDatasets.get(site.id)).filter(t => t !== undefined) as ColumnTable[];
}

export const totalRecords = () => [...siteDatasets.values()].reduce((acc, tbl) => acc + tbl.numRows(), 0);

export async function loadDatasets() {
	type DatasetRecord = Record<string, any> & { date: Date } & { siteId: SiteId };
	const sitesRecords: Map<string, DatasetRecord[]> = new Map();

	const finishedLoading = startedLoading("Datasets");

	const promises = dataPathsStartingWith('datasets/').map(async (path) => {
		return loadDataCsv(path);
	});

	const filesRecords = await Promise.all(promises);
	const records = filesRecords.flat();
	// console.log('sitesRecords loaded. records.length = ', records.length, 'record[0] = ', records[0])

	const validKeys = varnames();
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

		if (!record.date && isNaN(record.date.valueOf()) || record.date.valueOf() > futureDateMs) {
			// console.warn('Invalid date in csv files', r.date, r, record.date);
			continue
		}

		const siteRecords = sitesRecords.get(r.siteId) || [];
		siteRecords.push(record as DatasetRecord);
		sitesRecords.set(r.siteId, siteRecords);
	}

	sitesRecords.forEach((records, siteId) => {
		const tbl = aq.from(records).orderby('date').dedupe('date').reify();
		const id = siteIds.get(siteId);
		if (id === undefined) {
			console.error(`Site integer ID not found for siteId: ${siteId}`);
			return;
		}
		siteDatasets.set(id, tbl);
	});

	defineGlobal('aq', aq);
	defineGlobal('siteDatasets', siteDatasets);

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


export async function appendSiteDatasetsToRealtimeDatasets() {
	console.log('Appending to realtime datasets: ', siteRealtimeDatasets.size, 'sites');
	if (siteRealtimeDatasets.size < 1) {
		console.log('No realtime datasets to append');
		return;
	}

	siteRealtimeDatasets.forEach((rtTable, siteId) => {
		if (rtTable.numRows() < 1) {
			console.log('No realtime dataset for site', siteId, 'skipping append');
			return;
		}

		const colRenames: any = { date: 'date'}
		const colNames = siteDatasets.get(siteId)?.columnNames() || [];
		if (colNames.includes('flow')) colRenames['flow'] = 'rtflow';
		if (colNames.includes('exceedance')) colRenames['exceedance'] = 'rtexceedance';


		const siteTable = siteDatasets.get(siteId)?.select(colRenames).orderby('date').reify();
		if (!siteTable) {
			console.warn(`No site dataset found for siteId: ${siteId}, skipping append`);
			return;
		}

		// console.log('prepared realtime siteDataset for site', siteId, 'with rows', siteTable.numRows());

		// const concatTable =
		const updatedTable = siteTable.concat(rtTable).orderby('date').reify();

		siteRealtimeDatasets.set(siteId, updatedTable);

		// const rtTbl = aq.from(rtTable).select('date', ...varnames()).reify();
		// siteRealtimeDatasets.set(siteId, rtTbl);
	});


}


