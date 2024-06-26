
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
		'id': 'sjriver-huc10',
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
			'line-color': '#584070',
			'line-width': 1,
		}
	});
}
