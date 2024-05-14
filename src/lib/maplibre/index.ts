import * as maptilersdk from '@maptiler/sdk';
import * as ml from 'maplibre-gl';


import { BasemapSwitcherControl, basemaps, initialBasemapStyle } from './BasemapSwitcherControl';
import { mapMouseLocation } from '$src/state/mapMouse.svelte';


export const createMaptilerMap = (mapContainer: HTMLDivElement, zoom?: number, center?: ml.LngLat) => {
	const maptilerKey = '4zPvHZlweLbGaEy9LI4Z';
	maptilersdk.config.apiKey = maptilerKey;

	zoom ??= 8;
	center ??= new ml.LngLat(-85.61660125969536, 41.82930544846346);

	const _map = new maptilersdk.Map({
		container: mapContainer, // container's id or the HTML element to render the map
		style: initialBasemapStyle,
		center: center, // starting position [lng, lat]
		zoom: zoom, // starting zoom
	});

	_map.addControl(new BasemapSwitcherControl({basemaps: basemaps, initialBasemap: initialBasemapStyle}), 'bottom-right');

	// add huc10 geojson layer
	_map.on('load', () => {
		_map.addSource('huc10', {
			type: 'geojson',
			data: '/layers/huc10.geojson',
		});
		_map.addLayer({
			id: 'huc10',
			type: 'fill',
			source: 'huc10',
			layout: {},
			paint: {
				'fill-color': '#088',
				'fill-opacity': 0.8,
				'fill-outline-color': '#a00'
			}
		});
	});


	_map.on('mousemove', (e): void => {
		// e.lngLat is the longitude, latitude geographical position of the event
		// e.point is the x, y coordinates of the mousemove event relative
		// console.log(e.lngLat.wrap());
		// console.log(e.point);
		mapMouseLocation.onMouseMove(_map, e);
	});

	_map.on('mouseout', (): void => {
		mapMouseLocation.onMouseOut()
	});

};
