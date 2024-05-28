import { geometries } from '$src/appstate/data/geometries.svelte';
import { loadDataJson } from '$src/lib/data/cachedDataLoad';
import * as ml from 'maplibre-gl';

export async function addSourceHuc10(map: ml.Map): Promise<void> {
	const data = await loadDataJson('geojson/huc10.geojson');
	geometries.setHuc10(data);

	map.addSource('huc10', {
		type: 'geojson',
		data: data,
		promoteId: 'huc10'
	});
}

export function rebuildLayersHuc10(map: ml.Map): void {
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



