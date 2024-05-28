import { geometries } from '$src/appstate/data/geometries.svelte';
import { loadDataJson } from '$src/lib/data/cachedDataLoad';
import * as ml from 'maplibre-gl';

export async function addSourceHuc10(map: ml.Map): Promise<void> {
	const data = await loadDataJson('geojson/huc10.geojson');
	geometries.setHuc10(data);

	map.addSource('sites-huc10', {
		type: 'geojson',
		data: data,
		promoteId: 'huc10'
	});
}

export function rebuildLayersHuc10(map: ml.Map): void {
	if (map.getLayer('sites-huc10-outline')) map.removeLayer('sites-huc10-outline');
	if (map.getLayer('sites-huc10')) map.removeLayer('sites-huc10');

	map.addLayer({
		id: 'sites-huc10',
		type: 'fill',
		source: 'sites-huc10',
		layout: {
		},
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
				0
			],
		}
	});

	map.addLayer({
		'id': 'sites-huc10-outline',
		'type': 'line',
		'source': 'sites-huc10',
		'layout': {},
		'paint': {
			'line-color': '#844',
			'line-width': 1,
			'line-opacity': [
				'case',
				['boolean', ['feature-state', 'selected'], false],
				1,
				0
			],

		}
	});
}
