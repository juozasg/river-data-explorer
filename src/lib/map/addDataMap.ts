import * as ml from 'maplibre-gl';

import { loadDataJson } from '$lib/data/cachedDataLoad';
import { geometries, type GeometryCollection } from '$src/appstate/data/geometries.svelte';

export async function addDataSourceGeoJSON(map: ml.Map, name: GeometryCollection | string, promoteId?: string | undefined) {
	const data = await loadDataJson(`geojson/${name}.geojson`);
	geometries.set(name, data);

	if(!map.getSource(`sjrbc-${name}`)) {
		map.addSource(`sjrbc-${name}`, {
			type: 'geojson',
			data: data,
			promoteId: promoteId
		});

	}
}

export async function addSources(map: ml.Map): Promise<void> {
	await Promise.all([
		addDataSourceGeoJSON(map, 'huc10', 'huc10'),
		addDataSourceGeoJSON(map, 'huc8', 'huc8'),
		addDataSourceGeoJSON(map, 'mainstem'),
		addDataSourceGeoJSON(map, 'tributaries')
	]);

	return Promise.resolve();
}

export function addRiverLayers(map: ml.Map): void {
	if (map.getLayer('sjrbc-mainstem')) map.removeLayer('sjrbc-mainstem');
	if (map.getLayer('sjrbc-tributaries')) map.removeLayer('sjrbc-tributaries');

	map.addLayer({
		id: 'sjrbc-mainstem',
		type: 'line',
		source: 'sjrbc-mainstem',
		layout: {
			'visibility': 'visible',
		},
		paint: {
			'line-color': '#00F',
			'line-width': 3,
			'line-opacity': 0.5,
		}
	});

	map.addLayer({
		id: 'sjrbc-tributaries',
		type: 'line',
		source: 'sjrbc-tributaries',
		layout: {
			'visibility': 'visible',
		},
		paint: {
			'line-color': '#00F',
			'line-width': 1.5,
			'line-opacity': 0.5,

		}
	});
}

export async function toggleRiverLayerVisibility(map: ml.Map, visible: boolean) {
	if(map.getLayer('sjrbc-mainstem')) map.setLayoutProperty('sjrbc-mainstem', 'visibility', visible ? 'visible' : 'none');
	if(map.getLayer('sjrbc-tributaries')) map.setLayoutProperty('sjrbc-tributaries', 'visibility', visible ? 'visible' : 'none');
}
