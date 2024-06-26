
import * as ml from 'maplibre-gl';
import { selectedArea } from '$src/appstate/map/hoveredSelectedFeatures.svelte';
import { addRiverLayers } from './mapData';


export async function addLayers(map: ml.Map): Promise<void> {
	selectedArea.applyFeatureState(map);
	addLayersHuc8(map);

	addRiverLayers(map);
	// addRiverHoverLayers(map);
}


function addLayersHuc8(map: ml.Map): void {
	map.addLayer({
		'id': 'sjriver-huc10-fill',
		'type': 'fill',
		'source': 'sjriver-huc10',
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
		'id': 'sjriver-huc10-outline',
		'type': 'line',
		'source': 'sjriver-huc10',
		'layout': {},
		'paint': {
			'line-color': '#0C2470',
			'line-width': 1,
			// 	'line-dasharray': [1, 1],
		}
	});
}



// function addRiverHoverLayers(map: ml.Map): void {
// 	const hoverColor = '#0a4358';
// 	map.addLayer({
// 		id: 'sjriver-river-hover-mainstem',
// 		type: 'line',
// 		source: 'sjriver-mainstem',
// 		layout: {
// 			'visibility': 'visible',
// 			'line-join': 'bevel',
// 			'line-cap': 'round'
// 		},
// 		paint: {
// 			'line-color': hoverColor,
// 			'line-width': 20,
// 			'line-opacity': [
// 				'case',
// 				['boolean', ['feature-state', 'hover'], false],
// 				1,
// 				0
// 			]
// 		}
// 	});

// 	map.addLayer({
// 		id: 'sjriver-river-hover-tributaries',
// 		type: 'line',
// 		source: 'sjriver-tributaries',
// 		layout: {
// 			'visibility': 'visible',
// 			'line-join': 'bevel',
// 			'line-cap': 'round'
// 		},
// 		paint: {
// 			'line-color': hoverColor,
// 			'line-width': 14,
// 			'line-opacity': [
// 				'case',
// 				['boolean', ['feature-state', 'hover'], false],
// 				1,
// 				0
// 			]
// 		}
// 	});
// }
