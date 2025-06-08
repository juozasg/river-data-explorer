import * as ml from 'maplibre-gl';

export function initMapSources(map: ml.Map) {

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

	map.addSource("riverapp-selected-region-1", {
		// generateId: true,
		promoteId: 'id',
		type: "geojson",
		data: {
			type: "FeatureCollection",
			features: []
		}
	});

	map.addSource("riverapp-selected-region-2", {
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
}
