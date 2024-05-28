import * as ml from 'maplibre-gl';
import { bounds } from './geoutils';

export function onceIdle(map: ml.Map) {
	return new Promise<void>((resolve) => {
			map.once('idle', () => resolve())
	})
}

export function fitFeatureBounds(map: ml.Map, feature: GeoJSON.Feature) {
	const geometry = feature.geometry as GeoJSON.Polygon;
	const coordinates: GeoJSON.Position[] = geometry.coordinates[0];

	console.log('zoomies', geometry, coordinates, map);
	map.fitBounds(bounds(coordinates), {
		padding: 20
	});
}
