import * as ml from 'maplibre-gl';
import { bounds } from './geoutils';
import type { Site } from '../types/site';
import type { BBoxLike } from '../types/basic';
import { MapFeature } from '$src/appstate/map/featureState.svelte';
import { geometries } from '$src/appstate/data/geometries.svelte';

export function onceIdle(map: ml.Map) {
	if (map.loaded()) return Promise.resolve();
	return new Promise<void>((resolve) => {
		map.once('idle', () => resolve())
	})
}

export function fitFeatureBounds(map: ml.Map, feature: MapFeature) {

	const geomfeat = geometries.get(feature.sourceType)?.features.find(f => f?.properties?.[feature.sourceType] == feature.id);
	const geometry = geomfeat?.geometry as GeoJSON.Polygon;
	const coordinates: GeoJSON.Position[] = geometry.coordinates[0];

	map.fitBounds(bounds(coordinates), {
		padding: 40
	});
}

export function setFeatureState(map: ml.Map, source: string, id: string | undefined | number, state: any) {
	// console.log('setFeatureState', source, id, state, map.loaded());
	try {
		map.setFeatureState(
			{ source, id },
			state
		);
	} catch (e) {
		console.error('setFeatureState failed', e);
	}
}


export function toggleoffAttribution(divElement: HTMLElement) {
	setTimeout(() => {
		const attribCtrl = divElement!.querySelectorAll('details.maplibregl-ctrl-attrib');
		attribCtrl.forEach((ctrl) => {
			ctrl.classList.remove('maplibregl-compact-show');
		});
	}, 1000);
}


export function makeSiteMarker(node: HTMLElement, map: ml.Map, site: Site) {
	const marker = new ml.Marker({ element: node }).setLngLat([site.lon, site.lat]).addTo(map);
	return {
		destroy() {
			marker.remove();
		}
	};
};

// sometimes layers dont exist
export function safeQueryRenderedFeatures(map: ml.Map, queryGeom: ml.PointLike | BBoxLike, layers: string[]) {
	try {
		const availableLayers = map.getLayersOrder();
		const layersToQuery = layers.filter((l) => availableLayers.includes(l));
		return map.queryRenderedFeatures(queryGeom, { layers: layersToQuery });
	} catch (e) {
		return [];
	}
}


export function queryMouseMoveHover(e: ml.MapMouseEvent, layers: string[], radius = 0): MapFeature | undefined {
	const map = e.target;

	let queryGeom: ml.PointLike | BBoxLike = e.point;
	if (radius) {
		queryGeom = [
			[e.point.x - radius, e.point.y - radius],
			[e.point.x + radius, e.point.y + radius]
		];
	}

	const features = safeQueryRenderedFeatures(map, queryGeom, layers);
	if (features.length < 1) return undefined;
	return new MapFeature(features[0].source, features[0].id as string | number);
}
