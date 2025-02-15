import * as ml from 'maplibre-gl';

import { loadDataJson } from '$lib/data/cachedDataLoad';
import { regionFeatures } from '$src/appstate/data/features.svelte';


export async function addMlmSources(map: ml.Map): Promise<void> {
	await Promise.all([
		addDataSourceGeoJSON(map, 'state', 'statefp'),
		addDataSourceGeoJSON(map, 'county', 'countyfp'),
		addDataSourceGeoJSON(map, 'huc12', 'huc12'),
		addDataSourceGeoJSON(map, 'huc10', 'huc10'),
		addDataSourceGeoJSON(map, 'huc8', 'huc8'),
		addDataSourceGeoJSON(map, 'river', 'id')
	]);

	return Promise.resolve();
}



export async function addDataSourceGeoJSON(map: ml.Map, name: string, promoteId?: string | undefined) {
	const data = await loadDataJson(`geojson/${name}.geojson`);

	regionFeatures.addGeoJSONCollection(name, promoteId || 'id', data);
	// console.log(data)
	// geometries.set(name, data)
	// geometriesIds.set(name, promoteId || 'id');

	if(!map.getSource(`riverapp-${name}`)) {
		map.addSource(`riverapp-${name}`, {
			type: 'geojson',
			data: data,
			promoteId: promoteId
		});

	}
}
