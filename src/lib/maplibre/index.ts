import * as maptilersdk from '@maptiler/sdk';
import { BasemapSwitcherControl, basemaps, initialBasemapStyle } from './BasemapSwitcherControl';


export const createMaptilerMap = (mapContainer: HTMLDivElement) => {
	const maptilerKey = '4zPvHZlweLbGaEy9LI4Z';
	maptilersdk.config.apiKey = maptilerKey;

	const _map = new maptilersdk.Map({
		container: mapContainer, // container's id or the HTML element to render the map
		style: initialBasemapStyle,
		center: [-86.24799777882635, 41.68664479708422], // starting position [lng, lat]
		zoom: 8, // starting zoom
	});

	_map.addControl(new BasemapSwitcherControl({basemaps: basemaps, initialBasemap: initialBasemapStyle}), 'bottom-right');
};
