

import { loadDataJson } from "$src/lib/data/cachedDataLoad";
import { defineGlobal } from "$src/lib/utils";
import { SvelteMap } from "svelte/reactivity";
import { buildFeatureSearchIndex } from "./basinFeatureSearchIndex.svelte";

export const riverappFeatures = ['site', 'huc8', 'huc10', 'huc12', 'state', 'county', 'river', 'site-catchment', 'river-catchment'] as const;
export type BasinFeatureType = typeof riverappFeatures[number];

export const riverappFeatureCollections = new SvelteMap<BasinFeatureType, GeoJSON.FeatureCollection>();


export async function loadFeatureCollections() {
	const promises = riverappFeatures.map(loadGeojsonData);
	await Promise.all(promises);

	defineGlobal('features', riverappFeatureCollections);

	buildFeatureSearchIndex();
}


export async function loadGeojsonData(name: BasinFeatureType) {
	const path = `geojson/${name}.geojson`;
	try {

		const data = await loadDataJson(path);

		riverappFeatureCollections.set(name, data);
		console.log('loaded', name);
	} catch (e) {
		console.error('Error loading geometry', path, e);
	}
}

export function findRiverappFeatureById(featureType: BasinFeatureType, id: number) {
	const featureCollection = riverappFeatureCollections.get(featureType);
	return featureCollection?.features.find(f => f.properties?.id === id);
}

export const riverappFeatureName = (featureType: BasinFeatureType, id: number) => {
	if(featureType === 'site-catchment') featureType = 'site';
	if(featureType === 'river-catchment') featureType = 'river';

	const feature = findRiverappFeatureById(featureType, id);
	if (feature) {
		return feature.properties?.name || `${featureType} ${id}`;
	}

}


// if(name === 'rivers') {
// 	console.log('SLEEEEP');
// 	await new Promise(r => setTimeout(r, 9000));
// }