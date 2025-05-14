import { loadBasinFipsData } from "$src/appstate/data/basinFipsAreas.svelte";
import { loadDatasets } from "$src/appstate/data/datasets.svelte";
import { loadGeoindexData } from "$src/appstate/data/geoindexes.svelte";
import { loadDatasetsUsgsWS } from "./loadDataUsgsWS";
import { loadMarkdown } from "./loadMarkdown";
import { loadSitesCsv } from "./loadSitesCsv";
import { loadDataCsv } from "../cachedDataLoad";
import { loadFeatureCollections } from "$src/appstate/data/riverappFeatureCollection.svelte";

export type SHA1Digest = string;
export type DataManifest = { [key: string]: SHA1Digest };
export const dataManifest: DataManifest = {};

export const datasetIds = new Map<string, number>();

export async function loadAppData(manifest: DataManifest) {
	Object.assign(dataManifest, manifest);

	console.log('Loading app data...');

	await loadDatasetsCsv();
	console.log('datasetIds', datasetIds);

	// async go brr
	loadFeatureCollections();
	loadBasinFipsData();
	loadSitesCsv(datasetIds);
	loadGeoindexData();
	loadDatasetsUsgsWS();
	loadDatasets();
	loadMarkdown();
}

export function dataPathsStartingWith(prefix: string) {
	return Object.keys(dataManifest).filter(k => k.startsWith(prefix));
}


async function loadDatasetsCsv() {
	const path = 'datasets.csv';
	const datasetsCsv = await loadDataCsv(path);

	for (const row of datasetsCsv) {
		// name,datasetId,id,description
		datasetIds.set(row.datasetId, parseInt(row.id));
	}
}
