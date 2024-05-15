import * as maptilersdk from '@maptiler/sdk';
import * as ml from 'maplibre-gl';
import type { LngLatLike } from 'maplibre-gl';

import { BasemapSwitcherControl, basemaps, initialBasemapStyle } from './BasemapSwitcherControl';
import { mapMouseLocation } from '$src/state/mapMouse.svelte';
// import { notify } from '$src/state/notifications.svelte';
import { createPolygonMouseListeners } from './polygon';



export const createMaptilerMap = (mapContainer: HTMLDivElement, zoom?: number, center?: LngLatLike) => {
	const maptilerKey = '4zPvHZlweLbGaEy9LI4Z';
	maptilersdk.config.apiKey = maptilerKey;

	zoom ??= 8;
	center ??= [-85.616, 41.825];

	const _map = new maptilersdk.Map({
		container: mapContainer, // container's id or the HTML element to render the map
		style: initialBasemapStyle,
		center: center, // starting position [lng, lat]
		zoom: zoom, // starting zoom
		minZoom: 3,
	});

	_map.addControl(new BasemapSwitcherControl(() => createLayers(_map), {basemaps: basemaps, initialBasemap: initialBasemapStyle}), 'bottom-right');

	// // add huc10 geojson layer
	_map.on('load', () => {
		createLayers(_map);
	});

	createMapEventListeners(_map);
	createMapLayerEventListeners(_map);
};

function createLayers(map: ml.Map) {
	map.addSource('huc10', {
		type: 'geojson',
		data: '/layers/huc10.geojson',
		promoteId: 'huc10'
	});

	map.addLayer({
		id: 'huc10',
		type: 'fill',
		source: 'huc10',
		layout: {},
		paint: {
			'fill-color': [
				'case',
				['boolean', ['feature-state', 'selected'], true],
				'#688',
				'#088'
			],
			'fill-opacity': [
				'case',
				['boolean', ['feature-state', 'hover'], false],
				0.8,
				0.3
			]
		}
	});

	map.addLayer({
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


function createMapEventListeners(map: ml.Map) {
	map.on('mousemove', (e): void => {
		// e.lngLat is the longitude, latitude geographical position of the event
		// e.point is the x, y coordinates of the mousemove event relative
		mapMouseLocation.onMouseMove(map, e);
	});

	map.on('mouseout', (): void => {
		mapMouseLocation.onMouseOut()
	});
}

function createMapLayerEventListeners(_map: ml.Map) {
	createPolygonMouseListeners(_map);
}
