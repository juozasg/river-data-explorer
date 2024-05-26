import { notify } from '$src/appstate/ui/notifications.svelte';
import parse from 'csv-simple-parser';
import { sha1 } from '../utils/digest';
import { dataManifest } from './loadAppData';

// https://raw.githubusercontent.com/juozasg/SJRBC-web-map-data/webapp/features/counties.csv
export async function loadCsv(path: string) {
	try {
		const text = await loadText(path);
		return parse(text, { header: true })
	} catch (e) {
		console.error(`Failed to load data from ${path}`, e);
		notify(`Failed to load data from ${path}`, 'error', 6000);
		return [];
	}
}

async function loadText(path: string) {
	// event.fetc
	const response = await fetchDataWithCache(path);
	// console.log(response)

	const text = await response.text();
	console.log('loadText', text.slice(0, 100) + '...')
	return text;
}

async function fetchDataWithCache(path: string) {
	const url = `/data/${path}`;
	const cache = await caches.open('river-website-data-cache');
	const manifestSha1 = dataManifest[path];

	const cachedResponse = await cache.match(url);
	if (cachedResponse && await sha1Matches(cachedResponse, manifestSha1)) {
		console.log('cache hit', path, manifestSha1);
		return cachedResponse;
	}

	const response = await fetch(url);
	if (!response.ok) throw new Error('Request failed.');

	cache.put(url, response.clone());

	return response;
}

async function sha1Matches(response: Response | undefined, expectedSha1: string | undefined) {
	if (!response || !expectedSha1) return false;
	const text = await response.clone().text();
	return expectedSha1 === await sha1(text);
}