import { loadDataJson } from "$src/lib/data/cachedDataLoad";
import { defineGlobal } from "$src/lib/utils";
import { SvelteMap } from "svelte/reactivity";

export const riverappFeatures = ['sites', 'huc8', 'huc10', 'huc12', 'states', 'counties', 'rivers', 'site-catchments', 'river-catchments'] as const;
export type RiverappFeaturesType = typeof riverappFeatures[number];

export const riverappFeatureCollections = new SvelteMap<RiverappFeaturesType, GeoJSON.FeatureCollection>();

export async function loadFeatureCollections() {
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

export function findRiverappFeatureById(featureType: RiverappFeaturesType, id: number) {
	const featureCollection = riverappFeatureCollections.get(featureType);
	return featureCollection?.features.find(f => f.properties?.id === id);
}

export const riverappFeatureName = (featureType: RiverappFeaturesType, id: number) => {
	const feature = findRiverappFeatureById(featureType, id);
	if (feature) {
		return feature.properties?.name || `${featureType} ${id}`;
	}

}


// if(name === 'rivers') {
// 	console.log('SLEEEEP');
// 	await new Promise(r => setTimeout(r, 9000));
// }