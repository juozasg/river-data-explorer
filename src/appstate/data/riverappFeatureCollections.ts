import { loadDataJson } from "$src/lib/data/cachedDataLoad";
import { SvelteMap } from "svelte/reactivity";

export const riverappFeatures = ['sites', 'huc8', 'huc10', 'huc12', 'states', 'counties', 'rivers', 'site-catchments', 'river-catchments'] as const;
export type RiverappFeaturesType = typeof riverappFeatures[number];

export const riverappFeatureCollections = new SvelteMap<RiverappFeaturesType, GeoJSON.FeatureCollection>();


export async function loadRiverappFeatureCollections() {
	const promises = riverappFeatures.map(loadGeojsonData);
	await Promise.all(promises);

	return Promise.resolve();
}

export async function loadGeojsonData(name: RiverappFeaturesType) {
	try {
		const data = await loadDataJson(`geojson/${name}.geojson`);

		riverappFeatureCollections.set(name, data);
		console.log('loaded', name);
	} catch(e) {
		console.error('Error loading geometry', name, e);
	}
}


	// await Promise.all([
	// 	loadGeojsonData('sites'),
	// 	loadGeojsonData('states'),
	// 	loadGeojsonData('counties'),
	// 	loadGeojsonData('huc12'),
	// 	loadGeojsonData('huc10'),
	// 	loadGeojsonData('huc8'),
	// 	loadGeojsonData('rivers'),
	// 	loadGeojsonData('river_catchments'),
	// 	loadGeojsonData('site_catchments'),
	// ]);

	// type RiverappFeaturesType = 'sites' | 'huc8' | 'huc10' | 'huc12' | 'states' | 'counties' | 'rivers' | 'site-catchments' | 'river-catchments';
