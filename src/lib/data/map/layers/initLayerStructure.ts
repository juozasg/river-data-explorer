import * as ml from 'maplibre-gl';

export const mlmInsertBeforeLayer = "Water line/label/Default";

export async function initLayerStructure(map: ml.Map) {

	// map.addSource("riverapp-sitez", {
	// 	type: "geojson",
	// 	data: geojsonData
	// 	// generateId: true,
	// });


	map.addSource("riverapp-regions", {
		// generateId: true,
		promoteId: 'id',
		type: "geojson",
		data: {
			type: "FeatureCollection",
			features: []
		}
	});

	map.addSource("riverapp-hovered-regions", {
		// generateId: true,
		promoteId: 'id',
		type: "geojson",
		data: {
			type: "FeatureCollection",
			features: []
		}
	});

	map.addSource("riverapp-selected-regions", {
		// generateId: true,
		promoteId: 'id',
		type: "geojson",
		data: {
			type: "FeatureCollection",
			features: []
		}
	});

	map.addSource("riverapp-rivers", {
		// generateId: true,
		promoteId: 'id',
		type: "geojson",
		data: {
			type: "FeatureCollection",
			features: []
		}
	});

	map.addSource("riverapp-hovered-rivers", {
		// generateId: true,
		promoteId: 'id',
		type: "geojson",
		data: {
			type: "FeatureCollection",
			features: []
		}
	});


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

	// two options:
	// 1. use riverapp-regions source and set "highlighed" feature-state to set opacity here
	// 2. use a separate source and layer for the outline
	// 2 is better. try to avoid maplibre feature-state and complicated expressions as much as possible
	map.addLayer(
		{
			id: "riverapp-regions-hover-outline",
			source: "riverapp-hovered-regions",
			type: "line",
			paint: {
				// "line-color": "#E3E676",
				"line-color": "#200",
				"line-width": 3
				// "fill-opacity": 0.5
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

	addRiverLayers(map);
}




function addRiverLayers(map: ml.Map): void {
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
					6,
					3.5

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
			'line-color':'#97E817',
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
}