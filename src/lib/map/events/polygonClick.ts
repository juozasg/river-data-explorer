import { selectedPolygonFeature } from '$src/state/mapPolygon.svelte';
import * as ml from 'maplibre-gl';

export function mapClicked(e: ml.MapMouseEvent) {
	const map = e.target;
	const feature = map.queryRenderedFeatures(e.point).filter((f) => f.layer.id === 'huc10')[0];


	selectedPolygonFeature.clear();

	selectedPolygonFeature.set(map, feature ?? null);
	console.log('selected', feature);
}