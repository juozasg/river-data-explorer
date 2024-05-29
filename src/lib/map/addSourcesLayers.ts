import * as ml from 'maplibre-gl';

import { loadDataJson } from '$lib/data/cachedDataLoad';
import { geometries, type GeometryCollection } from '$src/appstate/data/geometries.svelte';
import { onceIdle } from '../utils/maplibre';

export async function addDataSourceGeoJSON(map: ml.Map, name: GeometryCollection, promoteId: string | undefined) {
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

export async function addRiverData(map: ml.Map): Promise<void> {
	for(const name of ['mainstem', 'tributaries']) {
		const data = await loadDataJson(`geojson/${name}.geojson`);
		console.log(name, data);

		if(!map.getSource(name)) {
			map.addSource(name, {
				type: 'geojson',
				data: data
			});
		}
	}

	addRiverLayers(map);
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
	console.log('toggleRiverLayerVisibility', visible, map._fullyLoaded);
	await onceIdle(map);
	console.log('ONCE IDLE toggleRiverLayerVisibility', visible, map._fullyLoaded);
	// console.log('toggleRiverLayerVisibility', visible);
	if(map.getLayer('mainstem')) map.setLayoutProperty('mainstem', 'visibility', visible ? 'visible' : 'none');
	if(map.getLayer('tributaries')) map.setLayoutProperty('tributaries', 'visibility', visible ? 'visible' : 'none');
}
