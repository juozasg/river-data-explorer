import { loadDataJson } from "$src/lib/data/cachedDataLoad";
import { defineGlobal } from "$src/lib/utils";
import { SvelteMap } from "svelte/reactivity";

export const riverappFeatures = ['sites', 'huc8', 'huc10', 'huc12', 'states', 'counties', 'rivers', 'site-catchments', 'river-catchments'] as const;
export type RiverappFeaturesType = typeof riverappFeatures[number];

export const riverappFeatureCollections = new SvelteMap<RiverappFeaturesType, GeoJSON.FeatureCollection>();


export async function loadRiverappFeatureCollections() {
	const promises = riverappFeatures.map(loadGeojsonData);
	await Promise.all(promises);

	defineGlobal('features', riverappFeatureCollections);
}

export async function loadGeojsonData(name: RiverappFeaturesType) {
	const path = `geojson/${name}.geojson`;
	try {
		const data = await loadDataJson(path);

		riverappFeatureCollections.set(name, data);
		console.log('loaded', name);
	} catch(e) {
		console.error('Error loading geometry', path, e);
	}
}

