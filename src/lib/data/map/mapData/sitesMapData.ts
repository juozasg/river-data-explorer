import * as ml from 'maplibre-gl';

import { addRiverLayers } from './mapData';

export async function addLayers(map: ml.Map): Promise<void> {
	addLayersHuc10(map);
	addRiverLayers(map);
}


function addLayersHuc10(map: ml.Map): void {
	if(map.getLayer('sjriver-sites-huc10-outline')) map.removeLayer('sjriver-sites-huc10-outline');
	if(map.getLayer('sjriver-sites-huc10')) map.removeLayer('sjriver-sites-huc10');

	map.addLayer({
		id: 'sjriver-sites-huc10',
		type: 'fill',
		source: 'sjriver-huc10',
		layout: {},
		paint: {
			// 'fill-color': [
			// 	'case',
			// 	['boolean', ['feature-state', 'selected'], false],
			// 	'#098',
			// 	'#698'
			// ],
			'fill-color': '#098',
			'fill-opacity': [
				'case',
				['boolean', ['feature-state', 'selected'], false],
				0.4,
				0
			],
		}
	});

	map.addLayer({
		'id': 'sjriver-huc10-outline',
		'type': 'line',
		'source': 'sjriver-huc10',
		'layout': {},
		'paint': {
			'line-color': '#584070',
			'line-width': 1,
			'line-opacity': 0.4,
		}
	});

	// map.addLayer({
	// 	'id': 'sites-huc10-outline',
	// 	'type': 'line',
	// 	'source': 'sjriver-huc10',
	// 	'layout': {},
	// 	'paint': {
	// 		'line-color': '#844',
	// 		'line-width': 4,
	// 		'line-opacity': 0.8,
	// 	}
	// });
}
