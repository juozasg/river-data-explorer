import * as ml from 'maplibre-gl';


export function addHoverTooltipPopup(map: ml.Map, feature: ml.MapGeoJSONFeature, popup: ml.Popup) {
	const hoveredName = feature.properties?.name;

	const geometry = feature.geometry as any;
	const point = geometry.coordinates[0][0];
	const description = `<h4>${hoveredName}</h4>`;

	// console.log(`huc10 ${hoveredPolygonFeature.id} (${hoveredName})`, feature, point);
	popup.setLngLat(point).setHTML(description).addTo(map);
}


export function clearHoverTooltipPopup(map: ml.Map, popup: ml.Popup) {
	map.getCanvas().style.cursor = '';
	popup.remove();
}
