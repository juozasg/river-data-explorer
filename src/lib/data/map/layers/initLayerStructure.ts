import * as ml from 'maplibre-gl';

export const mlmInsertBeforeLayer = "Water line/label/Default";

export async function initLayerStructure(map: ml.Map) {

	// map.addSource("riverapp-sitez", {
	// 	type: "geojson",
	// 	data: geojsonData
	// 	// generateId: true,
	// });


	map.addSource("riverapp-regions", {
		generateId: true,
		type: "geojson",
		data: {
			type: "FeatureCollection",
			features: []
		}
	});

	map.addSource("riverapp-hovered-regions", {
		generateId: true,
		type: "geojson",
		data: {
			type: "FeatureCollection",
			features: []
		}
	});

	map.addSource("riverapp-selected-regions", {
		generateId: true,
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
				"line-color": "#E3E676",
				"line-width": 3
				// "fill-opacity": 0.5
			}
		},
		mlmInsertBeforeLayer
	);
}