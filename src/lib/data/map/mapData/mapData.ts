import * as ml from 'maplibre-gl';

import { loadDataJson } from '$lib/data/cachedDataLoad';
import { geometries, type GeometryCollection } from '$src/appstate/data/geometries.svelte';

export async function addDataSourceGeoJSON(map: ml.Map, name: GeometryCollection | string, promoteId?: string | undefined) {
	const data = await loadDataJson(`geojson/${name}.geojson`);
	geometries.set(name, data);

	if(!map.getSource(`riverapp-${name}`)) {
		map.addSource(`riverapp-${name}`, {
			type: 'geojson',
			data: data,
			promoteId: promoteId
		});

	}
}

export async function addMlmSources(map: ml.Map): Promise<void> {
	await Promise.all([
		addDataSourceGeoJSON(map, 'huc10', 'huc10'),
		addDataSourceGeoJSON(map, 'huc8', 'huc8'),
		addDataSourceGeoJSON(map, 'river', 'id')
	]);

	return Promise.resolve();
}

export function addRiverLayers(map: ml.Map): void {
	if(map.getLayer('riverapp-river')) map.removeLayer('riverapp-river');

	const mainstemColor = '#17a0d1';
	const tributariesColor = '#1db2e7';

	map.addLayer({
		id: 'riverapp-river',
		type: 'line',
		source: 'riverapp-river',
		layout: {
			'visibility': 'visible',
			'line-join': 'bevel',
			'line-cap': 'round'
		},
		paint: {
			'line-color': [
				'case',
				['boolean', ['feature-state', 'hover'], false],
				'#97E817',
				['case',
					['==', ['get', 'name'], 'Saint Joseph River'],
					mainstemColor,
					tributariesColor
				]
			],
			'line-width': [
				'case',
				['boolean', ['feature-state', 'hover'], false],
				6,
				['case',
					['==', ['get', 'name'], 'Saint Joseph River'],
					4.5,
					2
				]
			],
			'line-opacity': 1,
		}
	});
}

export async function toggleRiverLayerVisibility(map: ml.Map, visible: boolean) {
	if(map.getLayer('riverapp-river')) map.setLayoutProperty('riverapp-river', 'visibility', visible ? 'visible' : 'none');
}
