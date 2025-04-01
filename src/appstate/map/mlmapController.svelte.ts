import * as ml from 'maplibre-gl';
import { initLayerStructure } from '$src/lib/data/map/layers/initLayerStructure';
import type { Site } from '$src/lib/types/site';

export class MLMapController {
	#map: ml.Map;
	#hoveredFeature = $state<ml.MapGeoJSONFeature>();

	// map initial style has been loaded. it is now safe to add layers
	constructor(map: ml.Map) {
		this.#map = map;

		initLayerStructure(map);

		map.once("idle", () => {
			console.log("mlmap data model is ready");
			this.addHoverListeners(map);
			// now safe to modify map sources and layers
			// randomizeRegionsSource();
		});


	}


	siteHovered(site: Site | undefined) {
	}



	addHoverListeners(map: ml.Map) {
		map.on('mousemove', 'riverapp-regions-fill', (e) => {
			// console.log('mousemove', e.features);

			if (e.features && e.features.length > 0) {
				const feature = e.features[0];
				const hoveredRegions = map.getSource("riverapp-hovered-regions") as ml.GeoJSONSource;
				// const sourceHoveredFeature = hoveredRegions.
				const hoveredRegionsData = hoveredRegions._data as GeoJSON.FeatureCollection<GeoJSON.Geometry>;
				const hoveredRegionsFeature = hoveredRegionsData.features[0];

				if (this.#hoveredFeature && this.#hoveredFeature.id === feature.id) {
					return;
				}
				// console.log('hoveredRegions', hoveredRegions);

				hoveredRegions.setData({
					type: "FeatureCollection",
					// features: e.features
					features: [feature]
				});
				this.#hoveredFeature = feature;
			}
		});

		map.on('mouseleave', 'riverapp-regions-fill', (e) => {

			const hoveredRegions = map.getSource("riverapp-hovered-regions") as ml.GeoJSONSource;
			hoveredRegions.setData({
				type: "FeatureCollection",
				features: []
			});

			this.#hoveredFeature = undefined;
		});
	}
}

// onMount(() => {
// 	console.log("mlmap", mlMapComponent);
// 	mapSelectionMode.mode = "river";
// });