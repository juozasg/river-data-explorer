import * as ml from 'maplibre-gl';

import { loadDataJson } from '$lib/data/cachedDataLoad';
import { geometries, type GeometryCollection } from '$src/appstate/data/geometries.svelte';

export async function addDataSourceGeoJSON(map: ml.Map, name: GeometryCollection | string, promoteId?: string | undefined) {
	const data = await loadDataJson(`geojson/${name}.geojson`);
	geometries.set(name, data);

	if(!map.getSource(name)) {
		map.addSource(name, {
			type: 'geojson',
			data: data,
			promoteId: promoteId
		});

	}
}

export async function addSources(map: ml.Map): Promise<void> {
	await Promise.all([
		addDataSourceGeoJSON(map, 'huc10', 'huc10'),
		addDataSourceGeoJSON(map, 'mainstem'),
		addDataSourceGeoJSON(map, 'tributaries')
	]);

	return Promise.resolve();
}

export function addRiverLayers(map: ml.Map): void {
	if (map.getLayer('mainstem')) map.removeLayer('mainstem');
	if (map.getLayer('tributaries')) map.removeLayer('tributaries');

	map.addLayer({
		id: 'mainstem',
		type: 'line',
		source: 'mainstem',
		layout: {
			'visibility': 'none',
		},
		paint: {
			'line-color': '#00F',
			'line-width': 3
		}
	});

	map.addLayer({
		id: 'tributaries',
		type: 'line',
		source: 'tributaries',
		layout: {
			'visibility': 'none',
		},
		paint: {
			'line-color': '#00F',
			'line-width': 1.5
		}
	});
}

export async function toggleRiverLayerVisibility(map: ml.Map, visible: boolean) {
	if(map.getLayer('mainstem')) map.setLayoutProperty('mainstem', 'visibility', visible ? 'visible' : 'none');
	if(map.getLayer('tributaries')) map.setLayoutProperty('tributaries', 'visibility', visible ? 'visible' : 'none');
}