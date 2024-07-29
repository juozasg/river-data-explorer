import { loadBasinFipsData } from "$src/appstate/data/basinFipsAreas.svelte";
import { loadDatasets } from "$src/appstate/data/datasets.svelte";
import { loadGeoindexData } from "$src/appstate/data/geoindexes.svelte";
import { loadDatasetsUsgsWS } from "./loadDataUsgsWS";
import { loadSitesCsv } from "./loadSitesCsv";
import { loadSitesUsgsWS } from "./loadSitesUsgsWS";

// data-manifest.json
export type SHA1Digest = string;
export const dataManifest: { [key: string]: SHA1Digest } = {};


// variables.yaml
export type VariableMetadata = { [key: string]: any } & { 'labels': { [key: string]: string } }
export const dataVariables: VariableMetadata = { 'labels': {} };

export async function loadAppData(manifest: object, variables: object) {
	Object.assign(dataManifest, manifest);
	Object.assign(dataVariables, variables);

	console.log('Loading app data...');

	// async go brr
	loadBasinFipsData();
	loadSitesCsv();
	// loadSitesUsgsWS();
	loadDatasetsUsgsWS();
	loadGeoindexData();
	loadDatasets();
}


export function dataPathsStartingWith(prefix: string) {
	return Object.keys(dataManifest).filter(k => k.startsWith(prefix));
}