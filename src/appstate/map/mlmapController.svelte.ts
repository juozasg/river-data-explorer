import * as ml from 'maplibre-gl';
import { initLayerStructure } from '$src/lib/data/map/layers/initLayerStructure';

export class MLMapController {
	#map: ml.Map;

	// map initial style has been loaded. it is now safe to add layers
	constructor(map: ml.Map) {
		this.#map = map;

		initLayerStructure(map);

		map.once("idle", () => {
			console.log("mlmap data model is ready");
			// now safe to modify map sources and layers
			// randomizeRegionsSource();
		});
	}

}
	// onMount(() => {
	// 	console.log("mlmap", mlMapComponent);
	// 	mapSelectionMode.mode = "river";
	// });