import { loadDataJson } from "$src/lib/data/cachedDataLoad";
import { defineGlobal } from "$src/lib/utils";
import { SvelteMap } from "svelte/reactivity";
import { buildFeatureSearchIndex } from "./basinFeatureSearchIndex.svelte";


// basin features are geometries used for MLM map
// basin objects are logical objects that can be selected in the app and have data associated with them
export const basinFeatures = ['site', 'huc8', 'huc10', 'huc12', 'state', 'county', 'river', 'site-catchment', 'river-catchment'] as const;
export type BasinFeatureType = typeof basinFeatures[number];

export const basinFeatureCollections = new SvelteMap<BasinFeatureType, GeoJSON.FeatureCollection>();


export async function loadFeatureCollections() {
	const promises = basinFeatures.map(loadGeojsonData);
	await Promise.all(promises);

	defineGlobal('features', basinFeatureCollections);

	buildFeatureSearchIndex();
}


export async function loadGeojsonData(name: BasinFeatureType) {
	const path = `geojson/${name}.geojson`;
	try {

		const data = await loadDataJson(path);

		basinFeatureCollections.set(name, data);
		console.log('loaded', name);
	} catch (e) {
		console.error('Error loading geometry', path, e);
	}
}

export function findRiverappFeatureById(featureType: BasinFeatureType, id: number) {
	const featureCollection = basinFeatureCollections.get(featureType);
	return featureCollection?.features.find(f => f.properties?.id === id);
}

export const basinFeatureName = (featureType: BasinFeatureType, id: number) => {
	if(featureType === 'site-catchment') featureType = 'site';
	if(featureType === 'river-catchment') featureType = 'river';

	const feature = findRiverappFeatureById(featureType, id);
	if (feature) {
		return feature.properties?.name || `${featureType} ${id}`;
	}
}

export function basinFeatureSiteId(featureType: BasinFeatureType, id: number): string | undefined {
	if(featureType === 'site-catchment') featureType = 'site';
	if(featureType !== 'site') return;


	const feature = findRiverappFeatureById(featureType, id);
	if (feature) {
		return feature.properties?.siteId || undefined;
	}
}


// if(name === 'rivers') {
// 	console.log('SLEEEEP');
// 	await new Promise(r => setTimeout(r, 9000));
// }