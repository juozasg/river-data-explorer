import { hoveredPolygonFeature } from '$src/state/mapPolygon.svelte';
import * as ml from 'maplibre-gl';

export function setHoverPolygon(map: ml.Map, feature: ml.MapGeoJSONFeature) {
	if (hoveredPolygonFeature.id) {
		map.setFeatureState(
			{ source: 'huc10', id: hoveredPolygonFeature.id },
			{ hover: false }
		);
	}

	hoveredPolygonFeature.set(feature);
	map.setFeatureState(
		{ source: 'huc10', id: hoveredPolygonFeature.id },
		{ hover: true }
	);
}
export function clearHoverPolygon(map: ml.Map) {
	if (hoveredPolygonFeature.id) {
		map.setFeatureState(
			{ source: 'huc10', id: hoveredPolygonFeature.id },
			{ hover: false }
		);
	}
	hoveredPolygonFeature.clear();
}
export function addHoverPolygonPopup(map: ml.Map, feature: ml.MapGeoJSONFeature, popup: ml.Popup) {
	const hoveredName = feature.properties?.name;

	const geometry = feature.geometry as any;
	const point = geometry.coordinates[0][0];
	const description = `<h4>${hoveredName}</h4>`;

	// console.log(`huc10 ${hoveredPolygonFeature.id} (${hoveredName})`, feature, point);
	popup.setLngLat(point).setHTML(description).addTo(map);
}
export function clearHoverPolygonPopup(map: ml.Map, popup: ml.Popup) {
	map.getCanvas().style.cursor = '';
	popup.remove();
}
