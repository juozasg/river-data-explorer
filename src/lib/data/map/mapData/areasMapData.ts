
import * as ml from 'maplibre-gl';
import { addRiverLayers } from './mapData';


export async function addMlmLayers(map: ml.Map): Promise<void> {
	addLayersHuc10(map);
	addRiverLayers(map);
}

function addLayersHuc10(map: ml.Map): void {
	map.addLayer({
		id: 'sjriver-huc10',
		type: 'fill',
		source: 'sjriver-huc10',
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
				0.8,
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
			'line-color': '#584070',
			'line-width': 1
		}
	});

// ////////
// 	map.addLayer({
// 		'id': 'sjriver-huc10',
// 		'type': 'fill',
// 		'source': 'sjriver-huc10',
// 		'layout': {},
// 		'paint': {
// 			'fill-color': '#698',
// 			'fill-opacity': [
// 				'case',
// 				['boolean', ['feature-state', 'hover'], false],
// 				0.6,
// 				0.3
// 			]
// 		}
// 	});

	// map.addLayer({
	// 	'id': 'sjriver-huc10-outline',
	// 	'type': 'line',
	// 	'source': 'sjriver-huc10',
	// 	'layout': {},
	// 	'paint': {
	// 		'line-color': '#584070',
	// 		'line-width': 1,
	// 	}
	// });
}

