// import { loadBasinFipsData } from "$src/appstate/data/basinFipsAreas.svelte";
import { loadFeatureCollections } from "$src/appstate/data/basinFeatureCollection.svelte";
import { appendSiteDatasetsToRealtimeDatasets, loadDatasets } from "$src/appstate/data/datasets.svelte";
import { loadGeoindexes } from "$src/appstate/data/geoindexes.svelte";
import { loadDataCsv } from "../cachedDataLoad";
import { loadMarkdown } from "./loadMarkdown";
import { loadRealtimeData } from "./loadRealtimeData";
import { loadSitesCsv } from "./loadSitesCsv";

export type SHA1Digest = string;
export type DataManifest = { [key: string]: SHA1Digest };
export const dataManifest: DataManifest = {};

export const datasetIds = new Map<string, number>();

export async function loadAppData(manifest: DataManifest) {
	Object.assign(dataManifest, manifest);

	console.log('Loading app data...');

	loadMarkdown();
	loadGeoindexes();

	await loadDatasetsCsv();
	console.log('datasetIds', datasetIds);
	await loadSitesCsv(datasetIds)
	console.log('sites.csv loaded');

	loadFeatureCollections();
	await Promise.all([loadDatasets(),loadRealtimeData()])

	appendSiteDatasetsToRealtimeDatasets();
	// loadDatasetsUsgsWS();
	// loadBasinFipsData()

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
