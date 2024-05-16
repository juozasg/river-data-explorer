import { hoveredPolygonFeature } from '$src/state/mapPolygon.svelte';
import * as ml from 'maplibre-gl';
import { setHoverPolygon, addHoverPolygonPopup, clearHoverPolygon, clearHoverPolygonPopup } from './polygonHover';
import { mapClicked } from './polygonClick';

export function createPolygonMouseListeners(map: ml.Map) {
	const popup = new ml.Popup({
		closeButton: false,
		closeOnClick: false
	});

	// When the user moves their mouse over the huc layer set hover state
	map.on('mousemove', 'huc10', (e) => {
		if (e!.features!.length > 0) {
			const feature = e.features![0];
			// different feature than current one
			if (hoveredPolygonFeature.id !== feature.id) {
				setHoverPolygon(map, feature);
				addHoverPolygonPopup(map, feature, popup);
			}
		}
	});

	// When the mouse leaves the huc layer clear hover state
	map.on('mouseleave', 'huc10', () => {
		clearHoverPolygon(map);
		clearHoverPolygonPopup(map, popup)
	});

	map.on('click', mapClicked);
}
