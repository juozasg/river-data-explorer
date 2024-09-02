import { loadBasinFipsData } from "$src/appstate/data/basinFipsAreas.svelte";
import { loadDatasets } from "$src/appstate/data/datasets.svelte";
import { loadGeoindexData } from "$src/appstate/data/geoindexes.svelte";
import { loadDatasetsUsgsWS } from "./loadDataUsgsWS";
import { loadMarkdown } from "./loadMarkdown";
import { loadSitesCsv } from "./loadSitesCsv";
// import { dataVariables } from "$src/appstate/dataVariables.svelte";
// import { loadSitesUsgsWS } from "./loadSitesUsgsWS";

// data-manifest.json
export type SHA1Digest = string;
export type DataManifest = { [key: string]: SHA1Digest };
export const dataManifest: DataManifest = {};

export async function loadAppData(manifest: DataManifest) {
	Object.assign(dataManifest, manifest);

	console.log('Loading app data...');

	// async go brr
	loadBasinFipsData();
	loadSitesCsv();
	loadGeoindexData();
	loadDatasetsUsgsWS();
	loadDatasets();
	loadMarkdown();
}


export function dataPathsStartingWith(prefix: string) {
	return Object.keys(dataManifest).filter(k => k.startsWith(prefix));
}