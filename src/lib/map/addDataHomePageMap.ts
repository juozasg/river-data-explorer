
import * as ml from 'maplibre-gl';
import { selectedArea } from '$src/appstate/map/hoveredSelectedFeatures.svelte';
import {  addRiverLayers} from './addDataMap';


export async function addLayers(map: ml.Map): Promise<void> {
	addRiverLayers(map);
	selectedArea.applyFeatureState(map);
	addLayersHuc8(map);
}


function addLayersHuc8(map: ml.Map): void {
	// if (map.getLayer('huc10-outline')) map.removeLayer('huc10-outline');
	// if (map.getLayer('huc10')) map.removeLayer('huc10');

	// map.addLayer({
	// 	type: 'raster',
	// 	source: 'basemap-outdoors',
	// 	id: 'basemap-outdoors',
	// });

	map.addLayer({
		'id': 'sjrbc-huc8-outline',
		'type': 'line',
		'source': 'sjrbc-huc8',
		'layout': {},
		'paint': {
			'line-color': '#e7ff35',
			'line-width': 2,
		// 	'line-dasharray': [1, 1],
		}
	});

}



