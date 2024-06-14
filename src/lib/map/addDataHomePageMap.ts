
import * as ml from 'maplibre-gl';
import { selectedArea } from '$src/appstate/map/hoveredSelectedFeatures.svelte';
import {  addRiverLayers} from './addDataMap';


export async function addLayers(map: ml.Map): Promise<void> {
	addRiverLayers(map);
	addRiverHoverLayers(map);

	selectedArea.applyFeatureState(map);
	addLayersHuc8(map);
}


function addLayersHuc8(map: ml.Map): void {

	map.addLayer({
		'id': 'sjrbc-huc10-fill',
		'type': 'fill',
		'source': 'sjrbc-huc10',
		'layout': {},
		'paint': {
			'fill-color': '#698',
			'fill-opacity': [
				'case',
				['boolean', ['feature-state', 'hover'], false],
				0.6,
				0.3
			]
		}
	});

	map.addLayer({
		'id': 'sjrbc-huc10-outline',
		'type': 'line',
		'source': 'sjrbc-huc10',
		'layout': {},
		'paint': {
			'line-color': '#0C2470',
			'line-width': 1,
		// 	'line-dasharray': [1, 1],
		}
	});

}





function addRiverHoverLayers(map: ml.Map): void {
	map.addLayer({
		id: 'sjrbc-river-hover-mainstem',
		type: 'line',
		source: 'sjrbc-mainstem',
		layout: {
			'visibility': 'visible',
		},
		paint: {
			'line-color': '#F00',
			'line-width': 8,
			'line-opacity': [
				'case',
				['boolean', ['feature-state', 'hover'], false],
				1,
				0.1
			]
		}
	});

	map.addLayer({
		id: 'sjrbc-river-hover-tributaries',
		type: 'line',
		source: 'sjrbc-tributaries',
		layout: {
			'visibility': 'visible',
		},
		paint: {
			'line-color': '#F00',
			'line-width': 8,
			'line-opacity': [
				'case',
				['boolean', ['feature-state', 'hover'], false],
				1,
				0.1
			]
		}
	});
}
