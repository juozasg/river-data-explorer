import * as ml from 'maplibre-gl';
import { initMapSources } from './initMapSources';
import { addRegionLayers, addRiverLayers, addOutlineLayers, addSiteLayers, addRasterLayers } from './initMapLayers';

export const mlmInsertBeforeLayer = "Water line/label/Default";

export async function initMapData(map: ml.Map) {
	console.log('initMapData');

	initMapSources(map);

	// LAYERS
	addRasterLayers(map);
	addRegionLayers(map);
	addRiverLayers(map);
	addOutlineLayers(map);
	addSiteLayers(map);
}


