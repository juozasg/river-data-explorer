import { mapMouseLocation } from '$src/appstate/map/mapMouse.svelte.svelte';
import type { Site } from '$src/lib/types/site';
import * as ml from 'maplibre-gl';

export default abstract class MapController {
	map: ml.Map;
	markersOnMap: ml.Marker[];

	constructor(map: ml.Map) {
		this.map = map;
		this.markersOnMap = [];
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

	// clearMarkers() {
	// 	for (const marker of this.markersOnMap) {
	// 		marker.remove();
	// 	}

	// 	this.markersOnMap = [];
	// }

	setSites(sites: Site[]) {
		console.log(`create ${sites.length} markers for map`, this.map)
		for (const marker of this.markersOnMap) {
			marker.remove();
		}

		this.markersOnMap = [];

		for (const site of sites) {
			try {
				const marker = new ml.Marker()
					.setLngLat([site.lon, site.lat])
					.addTo(this.map);
					this.markersOnMap.push(marker);
			} catch (error) {
				console.log('Error adding site marker', error, site);
			}

		}
	}
}