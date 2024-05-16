import { mapMouseLocation } from '$src/state/mapMouse.svelte';
import * as ml from 'maplibre-gl';

export default abstract class MapController {
	map: ml.Map;

	constructor(map: ml.Map) {
		this.map = map;
	}

	abstract createLayers(): void;
	abstract createEventListeners(): void;

	protected createMouseCoordinatesListeners() {
		this.map.on('mousemove', (e): void => {
			// e.lngLat is the longitude, latitude geographical position of the event
			// e.point is the x, y coordinates of the mousemove event relative
			mapMouseLocation.onMouseMove(this.map, e);
		});

		this.map.on('mouseout', (): void => {
			mapMouseLocation.onMouseOut();
		});
	}

}