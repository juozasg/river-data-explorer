import * as aq from 'arquero';
import { dataPathsStartingWith } from "./loadAppData";
import { siteRealtimeDatasets } from '$src/appstate/data/datasets.svelte';
import { defineGlobal } from '$src/lib/utils';
import { loadDataText } from '../cachedDataLoad';
import { rtSiteIds, siteIds } from '$src/appstate/data/sites.svelte';

type RTRecord = { date: Date, rtflow: number }

function parseLine(line: string): RTRecord | null {
	const values = line.split(',');
	if (values.length < 2) return null; // Skip empty lines

	const timestamp = parseInt(values[0]);
	const rtflow = parseFloat(values[1]);
	if (isNaN(timestamp) || isNaN(rtflow)) return null; // Skip invalid lines
	const date = new Date(timestamp * 1000); // Convert seconds to milliseconds

	return { date, rtflow };
}


export async function loadRealtimeData() {
	const rtFiles = dataPathsStartingWith('realtime/')
	rtFiles.forEach(f => rtSiteIds.add(f.split('/').at(-1)?.replace('.csv', '')!));

	const promises = rtFiles.map(async (path) => {
		const siteId = path.split('/').at(-1)?.replace('.csv', '');
		// console.log('Loading realtime data for site:', siteId, 'from', path);

		const text = await loadDataText(path);

		return [siteId, text];
	})

	const siteRecords = new Map<string, RTRecord[]>();
	const allSitesText = await Promise.all(promises);
	allSitesText.forEach(([siteId, text]) => {
		const lines = text!.split('\n').slice(1); // Skip header line
		const records: RTRecord[] = [];

		lines.forEach(line => {
			const record = parseLine(line);
			if (!record) return; // Skip invalid lines
			records.push(record);
		});

		if (records.length > 0) {
			const sid = siteId!;
			if(!siteRecords.has(sid)) {
				siteRecords.set(sid, []);
			}

			siteRecords.set(sid, siteRecords.get(sid)!.concat(records));

		} else {
			console.warn(`No realtime data found for site ${siteId}`);
		}
	})


	siteRecords.forEach((records, siteId) => {
		if (records.length < 1) {
			console.warn(`No realtime data found for site ${siteId}`);
			return;
		}

		// Create a ColumnTable for the site
		const table = aq.from(records).orderby('date').reify();
		const id = siteIds.get(siteId);
		if (!id) {
			console.error(`Site integer ID not found for siteId: ${siteId}`);
			return;
		}

		siteRealtimeDatasets.set(id, table);
	});

	defineGlobal('siteRealtimeDatasets', siteRealtimeDatasets);
	setInterval(updateRealtimeData, 15 * 60 * 1000); // Update every 15 minutes
	await updateRealtimeData(); // Initial update
}

export async function updateRealtimeData() {
	const promises = Array.from(rtSiteIds).map(async (siteId) => {
		const t = siteRealtimeDatasets.get(siteIds.get(siteId)!)!;
		const lastRow: RTRecord = t.object(t.numRows() - 1) as RTRecord;

		const timestamp = Math.floor(lastRow.date.getTime() / 1000); // Convert to seconds
		const url = `https://timeseries.riverdata.app:5003/timeseries-since/${siteId}/${timestamp}`;

		// console.log('Fetching realtime data for site:', siteId, 'from', url);
		const response = await fetch(url);
		if (!response.ok) {
			console.error(`Failed to fetch realtime data for site ${siteId}:`, response.statusText);
			return;
		}
		const text = await response.text();
		const lines = text.split('\n').slice(1); // Skip header line
		const newRecords: RTRecord[] = [];
			lines.forEach(line => {
			const record = parseLine(line);
			if (!record) return; // Skip invalid lines
			newRecords.push(record);
		});

		// console.log('updateRealtimeData', siteId, 'newRecords.length = ', newRecords.length, 'from lastRow = ', lastRow);

		if (newRecords.length > 0) {
			const existingTable = siteRealtimeDatasets.get(siteIds.get(siteId)!);
			const newTable = aq.from(newRecords).orderby('date').reify();
			if (existingTable) {
				const updatedTable = existingTable.concat(newTable).orderby('date').reify();
				siteRealtimeDatasets.set(siteIds.get(siteId)!, updatedTable);
			}
		}
	});

	await Promise.all(promises);
}