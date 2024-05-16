import { createPolygonMouseListeners } from '../events/polygon';
import MapController from './mapController';

export default class AreasMap extends MapController {
	createLayers() {
		this.map.addSource('huc10', {
			type: 'geojson',
			data: '/layers/huc10.geojson',
			promoteId: 'huc10'
		});

		this.map.addLayer({
			id: 'huc10',
			type: 'fill',
			source: 'huc10',
			layout: {},
			paint: {
				'fill-color': [
					'case',
					['boolean', ['feature-state', 'selected'], false],
					'#098',
					'#698'
				],
				'fill-opacity': [
					'case',
					['boolean', ['feature-state', 'hover'], false],
					0.6,
					['boolean', ['feature-state', 'selected'], false],
					0.7,
					0.3
				]
			}
		});

		this.map.addLayer({
			'id': 'huc10-outline2',
			'type': 'line',
			'source': 'huc10',
			'layout': {},
			'paint': {
				'line-color': '#844',
				'line-width': 1
			}
		});
	}

	createEventListeners() {
		this.createMouseCoordinatesListeners();
		this.createMapLayerEventListeners();
	}


	private createMapLayerEventListeners() {
		createPolygonMouseListeners(this.map);
	}
}