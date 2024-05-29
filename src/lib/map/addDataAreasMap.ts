
import * as ml from 'maplibre-gl';
import { onceIdle } from '../utils/maplibre';
import { selectedArea } from '$src/appstate/map/hoveredSelectedFeatures.svelte';
import { addDataSourceGeoJSON, addRiverData } from './addSourcesLayers';

export async function addDataHuc10(map: ml.Map): Promise<void> {
 	await addDataSourceGeoJSON(map, 'huc10', 'huc10');
	await onceIdle(map);

	addRiverData(map);
	selectedArea.dataReloaded(map);
	addLayersHuc10(map);
}

function addLayersHuc10(map: ml.Map): void {
	if (map.getLayer('huc10-outline')) map.removeLayer('huc10-outline');
	if (map.getLayer('huc10')) map.removeLayer('huc10');

	map.addLayer({
		id: 'huc10',
		type: 'fill',
		source: 'huc10',
		layout: {},
		paint: {
			'fill-color': [
				'case',
				['boolean', ['feature-state', 'selected'], false],
				'#098',
				'#698'
			],
			'fill-opacity': [
				'case',
				['boolean', ['feature-state', 'hover'], false],
				0.6,
				['boolean', ['feature-state', 'selected'], false],
				0.7,
				0.3
			]
		}
	});

	map.addLayer({
		'id': 'huc10-outline',
		'type': 'line',
		'source': 'huc10',
		'layout': {},
		'paint': {
			'line-color': '#844',
			'line-width': 1
		}
	});
}



