import * as ml from 'maplibre-gl';
import { mlmInsertBeforeLayer } from './initMapData';

export function addRegionLayers(map: ml.Map): void {
	map.addLayer(
		{
			id: "riverapp-regions",
			source: "riverapp-regions",
			type: "line",
			paint: {
				"line-color": "#088",
				"line-width": 2,
				"line-opacity": 0
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
				"fill-opacity": 0.2,
				// "fill-opacity": 0,
				"fill-color": "#088"
			}
		},
		mlmInsertBeforeLayer
	);


	map.addLayer(
		{
			id: "riverapp-regions-hovered-fill",
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
			'line-color': '#97E817',
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
				"line-color": "#200",
				"line-width": 1
				// "fill-opacity": 0.5
			}
		},
		mlmInsertBeforeLayer
	);
}