import { mapMouseLocation } from '$src/appstate/map/mapMouse.svelte';
import * as ml from 'maplibre-gl';

export function listenMouseMoveCoordinates(map: ml.Map) {
	map.on('mousemove', (e): void => {
		// e.lngLat is the longitude, latitude geographical position of the event
		// e.point is the x, y coordinates of the mousemove event relative
		mapMouseLocation.onMouseMove(map, e);
	});

	map.on('mouseout', (): void => {
		mapMouseLocation.onMouseOut();
	});
}