import parse from 'csv-simple-parser';

import { notify } from '$src/appstate/ui/notifications.svelte';
import { sha1 } from '../utils/digest';
import { dataManifest } from './loaders/loadAppData';
import { retryingFetch } from '../utils/retryingFetch';

// https://raw.githubusercontent.com/juozasg/SJRBC-web-map-data/webapp/features/counties.csv
export async function loadDataCsv(path: string): Promise<Record<string, any>[]> {
	try {
		const text = await loadDataText(path);
		const lines = text.trim().split("\n").filter(line => line.trim() !== "");
		const withoutEmptyLines = lines.join("\n");

		return parse(withoutEmptyLines, { header: true })
	} catch (e) {
		console.error(`Failed to load data from ${path}`, e);
		notify(`Failed to load data from ${path}`, 'error', 6000);
		return [];
	}
}

export async function loadDataJson(path: string) {
	const response = await fetchDataWithCache(path);
	// console.log(response)

	// const text = await response.clone().text();
	// console.log('loadDataJson', text.slice(0, 100) + '...')
	return response.json();
}


export async function loadDataText(path: string) {
	const response = await fetchDataWithCache(path);
	// console.log(response)

	const text = await response.text();
	// console.log('loadDataText', text.slice(0, 100) + '...')
	return text;
}

async function fetchDataWithCache(path: string) {
	const url = `/data/${path}`;
	const cache = await caches.open('river-website-data-cache');
	const manifestSha1 = dataManifest[path];

	const cachedResponse = await cache.match(url);
	if (cachedResponse && await sha1Matches(cachedResponse, manifestSha1)) {
		// console.log('data cache hit', path, manifestSha1);
		return cachedResponse;
	}

	const response = await retryingFetch(url);
	console.log('data fetch ', url);

	if (!response.ok) throw new Error('Request failed.');

	cache.put(url, response.clone());

	return response;
}

export async function fetchCachedTile(url: string) {
	const cache = await caches.open('river-website-data-cache');
	const cachedResponse = await cache.match(url);
	if (cachedResponse) {
		console.log('tile cache hit', url);
		return cachedResponse;
	}

	const response = await fetch(url);
	console.log('tile fetch ', url);

	if (!response.ok) throw new Error('Request failed.');

	cache.put(url, response.clone());

	return response;
}


async function sha1Matches(response: Response | undefined, expectedSha1: string | undefined) {
	if (!response || !expectedSha1) return false;
	const text = await response.clone().text();
	return expectedSha1 === await sha1(text);
}