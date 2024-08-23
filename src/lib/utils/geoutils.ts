import * as ml from 'maplibre-gl';

export function bounds(coordinates: ml.LngLatLike[] | GeoJSON.Position[]): ml.LngLatBounds {
	// Pass the first coordinates in the LineString to `lngLatBounds` &
	// wrap each coordinate pair in `extend` to include them in the bounds
	// result. A variation of this technique could be applied to zooming
	// to the bounds of multiple Points or Polygon geomteries - it just
	// requires wrapping all the coordinates with the extend method.
	const lonLats = coordinates as ml.LngLat[];
	return lonLats.reduce(
		(bounds, coord) => {
			return bounds.extend(coord);
		},
		new ml.LngLatBounds(lonLats[0], lonLats[0])
	);
}