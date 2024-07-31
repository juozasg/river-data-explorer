import { loadBasinFipsData } from "$src/appstate/data/basinFipsAreas.svelte";
import { loadDatasets } from "$src/appstate/data/datasets.svelte";
import { loadGeoindexData } from "$src/appstate/data/geoindexes.svelte";
import type { VariableMetadata } from "$src/lib/types/variableMetadata";
import { loadDatasetsUsgsWS } from "./loadDataUsgsWS";
import { loadSitesCsv } from "./loadSitesCsv";
// import { dataVariables } from "$src/appstate/dataVariables.svelte";
// import { loadSitesUsgsWS } from "./loadSitesUsgsWS";

// data-manifest.json
export type SHA1Digest = string;
export type DataManifest = { [key: string]: SHA1Digest };
export const dataManifest: DataManifest = {};


// variables.yaml


export async function loadAppData(manifest: DataManifest, variableMetadata: VariableMetadata) {
	Object.assign(dataManifest, manifest);

	console.log('Loading app data...');

	// async go brr
	loadBasinFipsData();
	loadSitesCsv();
	loadGeoindexData();
	// loadSitesUsgsWS();
	loadDatasetsUsgsWS(variableMetadata);
	loadDatasets(variableMetadata);
}


export function dataPathsStartingWith(prefix: string) {
	return Object.keys(dataManifest).filter(k => k.startsWith(prefix));
}