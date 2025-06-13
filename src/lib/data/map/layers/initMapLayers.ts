import * as ml from 'maplibre-gl';
import { mlmInsertBeforeLayer } from './initMapData';
import { data1Color, data2Color, mapHoverHighlightColor } from '$src/lib/utils/colors';

export function addRegionLayers(map: ml.Map): void {
	// REGIONS FOR HOVER
	map.addLayer(
		{
			id: "riverapp-regions",
			source: "riverapp-regions",
			type: "line",
			paint: {
				"line-color": "#333",
				"line-width": 0.5,
				"line-opacity": 1
			}
		},
		mlmInsertBeforeLayer
	);

	map.addLayer(
		{
			id: "riverapp-regions-fill",
			source: "riverapp-regions",
			type: "fill",
			paint: {
				"fill-opacity": 0.05,
				// "fill-opacity": 0,
				"fill-color": "#088"
			}
		},
		mlmInsertBeforeLayer
	);

	// HOVERED REGIONS
	map.addLayer(
		{
			id: "riverapp-hovered-regions-fill",
			source: "riverapp-hovered-regions",
			type: "fill",
			paint: {
				"fill-opacity": 0.2,
				// "fill-opacity": 0,
				"fill-color": "#088"
			}
		},
		mlmInsertBeforeLayer
	);

	// SELECTED REGIONS
	map.addLayer(
		{
			id: "riverapp-selected-region-1",
			source: "riverapp-selected-region-1",
			type: "line",
			paint: {
				"line-color": data1Color,
				"line-width": 3,
				"line-opacity": 1
			}
		},
		mlmInsertBeforeLayer
	);

	map.addLayer(
		{
			id: "riverapp-selected-regions-2",
			source: "riverapp-selected-region-2",
			type: "line",
			paint: {
				"line-color": data2Color,
				"line-width": 3,
				"line-opacity": 1
			}
		},
		mlmInsertBeforeLayer
	);

}

export function addRiverLayers(map: ml.Map): void {
	const mainstemColor = '#17a0d1';
	const tributariesColor = '#1db2e7';

	map.addLayer({
		id: 'riverapp-rivers',
		type: 'line',
		source: 'riverapp-rivers',
		layout: {
			'visibility': 'visible',
			'line-join': 'bevel',
			'line-cap': 'round'
		},
		paint: {
			'line-color': [
				'case',
				['==', ['get', 'name'], 'Saint Joseph River'],
				mainstemColor,
				tributariesColor
			],
			'line-width': [
				'case',
				['==', ['get', 'name'], 'Saint Joseph River'],
				5,
				2.5
			],
			'line-opacity': 1,
		}
	},
		mlmInsertBeforeLayer
	);

	map.addLayer({
		id: 'riverapp-hovered-rivers',
		type: 'line',
		source: 'riverapp-hovered-rivers',
		layout: {
			'visibility': 'visible',
			'line-join': 'bevel',
			'line-cap': 'round'
		},
		paint: {
			'line-color': mapHoverHighlightColor,
			'line-width': [
				'case',
				['boolean', ['feature-state', 'hover'], false],
				6,
				['case',
					['==', ['get', 'name'], 'Saint Joseph River'],
					8,
					6
				]
			],
			'line-opacity': 1,
		}
	},
		mlmInsertBeforeLayer
	);


	// HITBOX
	map.addLayer({
		id: 'riverapp-rivers-hitbox',
		type: 'line',
		source: 'riverapp-rivers',
		layout: {
			'visibility': 'visible',
			'line-join': 'bevel',
			'line-cap': 'round'
		},
		paint: {
			'line-color': [
				'case',
				['==', ['get', 'name'], 'Saint Joseph River'],
				mainstemColor,
				tributariesColor
			],
			'line-width': 20,
			'line-opacity': 0,
		}
	},
		mlmInsertBeforeLayer
	);
}

export function addOutlineLayers(map: ml.Map) {
	map.addLayer(
		{
			id: "riverapp-regions-hover-outline",
			source: "riverapp-hovered-regions",
			type: "line",
			paint: {
				// "line-color": "#E3E676",
				"line-color": "#97E817",
				"line-width": 2
				// "fill-opacity": 0.5
			}
		},
		mlmInsertBeforeLayer
	);
}


export function addSiteLayers(map: ml.Map): void {
	// ALL SITES

	map.addLayer(
		{
			id: "riverapp-sites",
			source: "riverapp-sites",
			type: "circle",
			paint: {
				"circle-stroke-color": '#000000',
				"circle-stroke-width": 1,
				"circle-stroke-opacity": ["feature-state", "opacity"],
				"circle-color": ["feature-state", "color"],
				"circle-radius": 6,
				"circle-opacity": ["feature-state", "opacity"]
			}
		},
		mlmInsertBeforeLayer
	);


	// SELECTED SITES
	map.addLayer(
		{
			id: "riverapp-selected-site-1",
			source: "riverapp-selected-site-1",
			type: "circle",
			paint: {
				"circle-stroke-color": data1Color,
				"circle-stroke-width": 4,
				"circle-stroke-opacity": 1,
				"circle-radius": 12,
				"circle-opacity": 0
			}
		},
		mlmInsertBeforeLayer
	);

	map.addLayer(
		{
			id: "riverapp-selected-sites-2",
			source: "riverapp-selected-site-2",
			type: "circle",
			paint: {
				"circle-stroke-color": data2Color,
				"circle-stroke-width": 4,
				"circle-stroke-opacity": 1,
				"circle-radius": 12,
				"circle-opacity": 0
			}
		},
		mlmInsertBeforeLayer
	);
}