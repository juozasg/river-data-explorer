import { notify } from '$src/appstate/ui/notifications.svelte';
import parse from 'csv-simple-parser';
import { sha1 } from '../utils/digest';

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
	// console.log(response)
	if (!response.ok) throw new Error('Request failed.');

	const text = await response.text();
	const sha = await sha1(text);
	console.log(text.slice(0, 100) + '...')
	console.log(sha)
	return text;
}