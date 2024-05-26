import { hoveredArea, selectedArea } from '$src/appstate/map/hoveredSelectedFeatures.svelte';
import MapController from './mapController';
import type { MapMouseEvent } from 'maplibre-gl';

export default class AreasMap extends MapController {
	createLayers() {
		this.map.addSource('huc10', {
			type: 'geojson',
			data: '/data/geojson/huc10.geojson',
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
			'id': 'huc10-outline',
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
		// When the user moves their mouse over the huc layer set hover state
		this.map.on('mousemove', 'huc10', (e) => {
			if (e!.features!.length > 0) {
				const feature = e.features![0];
				hoveredArea.update(this.map, feature);
			}
		});

		// When the mouse leaves the huc layer clear hover state
		this.map.on('mouseleave', 'huc10', () => {
			hoveredArea.clear(this.map);
		});

		this.map.on('click', (e) => this.mapClicked(e));
	}

	private mapClicked(e: MapMouseEvent) {
		const feature = this.map.queryRenderedFeatures(e.point).filter((f) => f.layer.id === 'huc10')[0];

		selectedArea.update(this.map, feature ?? null);

		const areaDetails = window.document.getElementById("section-select-area-data");
		console.log('areaDetails', areaDetails);
		if(areaDetails) {
			areaDetails.scrollIntoView({behavior: "smooth", block: "start"});
		}
		console.log('selected', feature);
	}

}