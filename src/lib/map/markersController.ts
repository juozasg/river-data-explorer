import * as ml from 'maplibre-gl';

import { Sites } from '$src/appstate/sites.svelte';
import type { Site } from '$src/lib/types/site';

export default abstract class MarkersCont {
	map: ml.Map;
	markersOnMap: ml.Marker[];

	constructor(map: ml.Map) {
		this.map = map;
		this.markersOnMap = [];
	}

	clearMarkers() {
		console.log(`MARKERS clear ${this.markersOnMap.length} for map`, this.map)
		for (const marker of this.markersOnMap) {
			marker.remove();
		}
		this.markersOnMap = [];
	}

	setSites(sitesState: Sites) {
		const sites: Site[] = sitesState.all;

		this.clearMarkers();

		return;

		console.log(`MARKERS create ${sites.length} for map`, this.map)
		for (const site of sites) {
			try {
				this.createMarker(site);
			} catch (error) {
				console.log('Error adding site marker', error, site);
			}

		}
	}

	private createMarker(site: Site) {
		let color = '#2299ff';
		switch (site.dataset) {
			case 'elkhart':
				color = '#2222ff';
				break;
			case 'usgs':
				color = '#22ffff';
				break;
			default:
				color = '#2299ff';
		};
		const marker = new ml.Marker({ color: color })
			.setLngLat([site.lon, site.lat])
			.addTo(this.map);
		this.markersOnMap.push(marker);
	}

}