import { loadBasinFipsData } from "$src/appstate/data/basinFipsAreas.svelte";
import { loadSitesCsv } from "$src/appstate/sites.svelte";

// data-manifest.json
export type SHA1Digest = string;
export const dataManifest: { [key: string]: SHA1Digest } = {};


// variables.yaml
export const dataVariables: { [key: string]: any }  = {};

export async function loadAppData(manifest: object, variables: object) {
	Object.assign(dataManifest, manifest);
	Object.assign(dataVariables, variables);

	console.log('Loading app data...');

	// async go brr
	loadBasinFipsData();
	loadSitesCsv();
}


export function dataPathsStartingWith(prefix: string) {
	return Object.keys(dataManifest).filter(k => k.startsWith(prefix));
}