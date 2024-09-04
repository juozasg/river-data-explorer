import * as ml from 'maplibre-gl';

import { addRiverLayers } from './riverLayers';

export async function addSitesDetailsMapLayers(map: ml.Map): Promise<void> {
	addLayersHuc10(map);
	addRiverLayers(map);
}


function addLayersHuc10(map: ml.Map): void {
	if(map.getLayer('riverapp-sites-huc10-outline')) map.removeLayer('riverapp-sites-huc10-outline');
	if(map.getLayer('riverapp-sites-huc10')) map.removeLayer('riverapp-sites-huc10');

	map.addLayer({
		id: 'riverapp-sites-huc10',
		type: 'fill',
		source: 'riverapp-huc10',
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
		'id': 'riverapp-huc10-outline',
		'type': 'line',
		'source': 'riverapp-huc10',
		'layout': {},
		'paint': {
			'line-color': '#584070',
			'line-width': 1,
			'line-opacity': 0.4,
		}
	});

}
