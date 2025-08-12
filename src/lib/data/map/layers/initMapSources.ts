import * as ml from 'maplibre-gl';

export function initMapSources(map: ml.Map) {

	map.addSource("riverapp-elevation-raster", {
		"type": "raster",
		"url":  "pmtiles://https://sjrbc-map-layers.nyc3.cdn.digitaloceanspaces.com/elevation-turbo-50-110.pmtiles"
	})

	map.addSource("riverapp-lulc-raster", {
		"type": "raster",
		"url":  "pmtiles://https://sjrbc-map-layers.nyc3.cdn.digitaloceanspaces.com/lulc2024-01.pmtiles"
	})

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

		map.addSource("riverapp-hovered-flow-regions", {
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


	map.addSource("riverapp-selected-site-1", {
		// generateId: true,
		promoteId: 'id',
		type: "geojson",
		data: {
			type: "FeatureCollection",
			features: []
		}
	});

	map.addSource("riverapp-selected-site-2", {
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


	map.addSource("riverapp-sites", {
		// generateId: true,
		promoteId: 'id',
		type: "geojson",
		data: {
			type: "FeatureCollection",
			features: []
		}
	});

	map.addSource("riverapp-hovered-sites", {
		// generateId: true,
		promoteId: 'id',
		type: "geojson",
		data: {
			type: "FeatureCollection",
			features: []
		}
	});
}
