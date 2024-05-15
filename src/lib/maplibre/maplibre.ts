import * as maptilersdk from '@maptiler/sdk';
import type { LngLatLike } from 'maplibre-gl';

import { BasemapSwitcherControl, basemaps, initialBasemapStyle } from './BasemapSwitcherControl';
import { mapMouseLocation } from '$src/state/mapMouse.svelte';
import { notify } from '$src/state/notifications.svelte';



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
	});

	_map.addControl(new BasemapSwitcherControl(() => createLayers(_map), {basemaps: basemaps, initialBasemap: initialBasemapStyle}), 'bottom-right');

	// // add huc10 geojson layer
	_map.on('load', () => {
		createLayers(_map);
	});

	createLayerEventListeners(_map);
};


function createLayers(map: maptilersdk.Map) {
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
			'fill-color': '#088',
			// 'fill-opacity': 0.8,
			// 'fill-outline-color': '#a00'
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

let hoveredHuc10: string | number | undefined;

function createLayerEventListeners(map: maptilersdk.Map) {
	map.on('mousemove', (e): void => {
		// e.lngLat is the longitude, latitude geographical position of the event
		// e.point is the x, y coordinates of the mousemove event relative
		mapMouseLocation.onMouseMove(map, e);
	});

	map.on('mouseout', (): void => {
		mapMouseLocation.onMouseOut()
	});

	// When the user moves their mouse over the huclayer, we'll update the
	// feature state for the feature under the mouse.
	map.on('mousemove', 'huc10', (e) => {
		if (e!.features!.length > 0) {
			const feature = e.features![0];
			if (hoveredHuc10 && hoveredHuc10 === feature.id) {
				return;
			}

			if (hoveredHuc10) {
				map.setFeatureState(
					{source: 'huc10', id: hoveredHuc10},
					{hover: false}
				);
			}

			hoveredHuc10 = feature.id;
			const hoveredName = feature.properties?.name;
			map.setFeatureState(
				{source: 'huc10', id: hoveredHuc10},
				{hover: true}
			);
			console.log(`huc10 ${hoveredHuc10} (${hoveredName})`, feature);
		}
	});

	// When the mouse leaves the huclayer, update the feature state of the
	// previously hovered feature.
	map.on('mouseleave', 'huc10', () => {
		// if (hoveredStateId) {
		// 	map.setFeatureState(
		// 		{source: 'huc10', id: hoveredStateId},
		// 		{hover: false}
		// 	);
		// }

		// hoveredStateId = undefined;
	});
}
