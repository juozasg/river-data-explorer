// import * as maptilersdk from '@maptiler/sdk';
// import * as ml from 'maplibre-gl';

// import type { LngLatLike } from 'maplibre-gl';

// import { BasemapSwitcherControl, basemaps, initialBasemapStyle } from './widgets/BasemapSwitcherControl';
// // import { notify } from '$src/state/notifications.svelte';
// import type MapController from './controllers/markersController';
// import AreasMap from './controllers/areasMap';
// import SitesMap from './controllers/sitesMap';

// export type MapType = 'areas' | 'sites';


// export function createMap(mapContainer: HTMLDivElement, type: MapType, zoom?: number, center?: LngLatLike) {
// 	const map = createMaptilerMap(mapContainer, zoom, center);

// 	let controller: MapController;

// 	switch (type) {
// 		case 'areas':
// 			controller = new AreasMap(map);
// 			break;
// 		case 'sites':
// 			controller = new SitesMap(map);
// 			break;
// 	}

// 	const createLayers = () => controller.createLayers();

// 	// map.on('load', createLayers);
// 	controller.createEventListeners();

// 	map.addControl(
// 		new BasemapSwitcherControl(
// 			createLayers,
// 			{
// 				basemaps: basemaps,
// 				initialBasemap: initialBasemapStyle
// 			}),
// 		'bottom-right');

// 	return controller;
// };


// function createMaptilerMap(mapContainer: HTMLDivElement, zoom?: number, center?: maptilersdk.LngLatLike) {
// 	const maptilerKey = '4zPvHZlweLbGaEy9LI4Z';
// 	maptilersdk.config.apiKey = maptilerKey;

// 	zoom ??= 8;
// 	center ??= [-85.616, 41.825];

// 	const map = new maptilersdk.Map({
// 		container: mapContainer, // container's id or the HTML element to render the map
// 		style: initialBasemapStyle,
// 		center: center, // starting position [lng, lat]
// 		zoom: zoom, // starting zoom
// 		minZoom: 3,
// 	});


// 	// const gs = ;


// 	const source: ml.SourceSpecification = {
// 		type: 'raster',
// 		tiles: ['https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'],
// 		tileSize: 256,
// 		minzoom: 0,
// 		maxzoom: 18,
// 		attribution: 'Google Maps'
// 	};

// 	const layer: ml.LayerSpecification = {
// 		id: 'satellite',
// 		type: 'raster',
// 		source: 'satellite',
// 		layout: {
// 			visibility: 'visible'
// 		}
// 	};

// 	map.on('load', () => {
// 		map.addSource('satellite', source);
// 		map.addLayer(layer);
// 	});


// 	console.log(map);

// 	// map.style.sourceCaches['basemap-v9'].update(map.transform)

// 	return map;
// }

