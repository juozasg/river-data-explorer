import { notify } from '$src/appstate/ui/notifications.svelte';
import parse from 'csv-simple-parser';

// https://raw.githubusercontent.com/juozasg/SJRBC-web-map-data/webapp/features/counties.csv
export async function parseCsv(path: string) {
	try {
		const text = await loadData(path);
		return parse(text, { header: true })
	} catch (e) {
		console.error(`Failed to load data from ${path}`, e);
		notify(`Failed to load data from ${path}`, 'error', 6000);
		return [];
	}
}

async function loadData(path: string) {
	const url = `https://raw.githubusercontent.com/juozasg/SJRBC-web-map-data/webapp/${path}`;
	const response = await fetch(url);
	if (!response.ok) throw new Error('Request failed.');

	const text = await response.text();
	return text;
}