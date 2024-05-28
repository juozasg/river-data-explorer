import * as ml from 'maplibre-gl';

import { geometries } from '$src/appstate/data/geometries.svelte';
import { loadDataJson } from '$src/lib/data/cachedDataLoad';
import { onceIdle } from '../utils/maplibre';
import { selectedArea } from '$src/appstate/map/hoveredSelectedFeatures.svelte';

export async function addDataHuc10(map: ml.Map): Promise<void> {
	const data = await loadDataJson('geojson/huc10.geojson');
	geometries.setHuc10(data);

	if (map.getSource('huc10')) return;

	map.addSource('huc10', {
		type: 'geojson',
		data: data,
		promoteId: 'huc10'
	});

	await onceIdle(map);
	selectedArea.dataReloaded(map);
	addLayersHuc10(map);
}

function addLayersHuc10(map: ml.Map): void {
	if (map.getLayer('sites-huc10-outline')) map.removeLayer('sites-huc10-outline');
	if (map.getLayer('sites-huc10')) map.removeLayer('sites-huc10');

	map.addLayer({
		id: 'sites-huc10',
		type: 'fill',
		source: 'huc10',
		layout: {},
		paint: {
			// 'fill-color': [
			// 	'case',
			// 	['boolean', ['feature-state', 'selected'], false],
			// 	'#098',
			// 	'#698'
			// ],
			'fill-color': '#CC8',
			'fill-opacity': [
				'case',
				['boolean', ['feature-state', 'selected'], false],
				0.4,
				0.
			],
		}
	});
	console.log('2', map.loaded());
	map.addLayer({
		'id': 'sites-huc10-outline',
		'type': 'line',
		'source': 'huc10',
		'layout': {},
		'paint': {
			'line-color': '#844',
			'line-width': 1,
			'line-opacity': 0.8,

		}
	});
	console.log('3', map.loaded());
	console.log(map.style._layers)
}
