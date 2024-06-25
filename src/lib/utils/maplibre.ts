import * as ml from 'maplibre-gl';
import { bounds } from './geoutils';
import type { Site } from '../types/site';

export function onceIdle(map: ml.Map) {
	if(map.loaded()) return Promise.resolve();
	return new Promise<void>((resolve) => {
		map.once('idle', () => resolve())
	})
}

export function fitFeatureBounds(map: ml.Map, feature: GeoJSON.Feature) {
	const geometry = feature.geometry as GeoJSON.Polygon;
	const coordinates: GeoJSON.Position[] = geometry.coordinates[0];

	// console.log('zoomies', geometry, coordinates, map);
	map.fitBounds(bounds(coordinates), {
		padding: 20
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



export function toggleoffAttribution(divElement: HTMLElement){
	setTimeout(() => {
		const attribCtrl = divElement!.querySelectorAll('details.maplibregl-ctrl-attrib');
		attribCtrl.forEach((ctrl) => {
			ctrl.classList.remove('maplibregl-compact-show');
		});
	}, 1000);
}


export function makeSiteMarker(node: HTMLElement, map: ml.Map,site: Site) {
	const marker = new ml.Marker({ element: node }).setLngLat([site.lon, site.lat]).addTo(map);
	return {
		destroy() {
			marker.remove();
		}
	};
};