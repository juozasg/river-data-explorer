import * as ml from 'maplibre-gl';
import { initLayerStructure } from '$src/lib/data/map/layers/initLayerStructure';
import type { Site } from '$src/lib/types/site';
import { riverappFeatureCollections } from '../data/riverappFeatureCollections';

export class MLMapController {
	#map: ml.Map;
	#hoveredRegionFeature = $state<ml.MapGeoJSONFeature>();
	#hoveredRiverFeature = $state<ml.MapGeoJSONFeature>();

	dataModelReady = $state(false)

	// map initial style has been loaded. it is now safe to add layers
	constructor(map: ml.Map) {
		this.#map = map;

		initLayerStructure(map);

		map.once("idle", () => {
			console.log("mlmap data model is ready");
			this.dataModelReady = true;
			this.addHoverListeners(map);
			// now safe to modify map sources and layers
			// randomizeRegionsSource();
		});


	}


	clearHoveredRegions() {
		const hoveredRegions = this.#map.getSource("riverapp-hovered-regions") as ml.GeoJSONSource;
		hoveredRegions.setData({
			type: "FeatureCollection",
			features: []
		});
	}


	siteHovered(site: Site | undefined) {
		console.log('siteHovered', site);

		if (site && site.intId) {
			const catchments = riverappFeatureCollections.get('site-catchments');
			if (catchments) {
				const siteCatchment = catchments.features.find(f => f.properties?.id === site.intId);
				console.log('siteCatchment', siteCatchment, catchments);

				if (siteCatchment) {
					const hoveredRegions = this.#map.getSource("riverapp-hovered-regions") as ml.GeoJSONSource;
					hoveredRegions.setData({
						type: "FeatureCollection",
						features: [siteCatchment]
					});
				}
			}
		} else {
			this.clearHoveredRegions();
		}
	}

	riverHovered(id: number | undefined) {
		console.log('riverHovered', id);

		if (id) {
			const catchments = riverappFeatureCollections.get('river-catchments');
			if (catchments) {
				const riverCatchment = catchments.features.find(f => f.properties?.id === id);
				console.log('riverCatchment', riverCatchment, catchments);

				if (riverCatchment) {
					const hoveredRegions = this.#map.getSource("riverapp-hovered-regions") as ml.GeoJSONSource;
					hoveredRegions.setData({
						type: "FeatureCollection",
						features: [riverCatchment]
					});
				}
			}
		} else {
			this.clearHoveredRegions()
		}
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

				if (this.#hoveredRegionFeature && this.#hoveredRegionFeature.id === feature.id) {
					return;
				}
				// console.log('hoveredRegions', hoveredRegions);

				hoveredRegions.setData({
					type: "FeatureCollection",
					// features: e.features
					features: [feature]
				});
				this.#hoveredRegionFeature = feature;
			}
		});

		map.on('mouseleave', 'riverapp-regions-fill', (e) => {

			const hoveredRegions = map.getSource("riverapp-hovered-regions") as ml.GeoJSONSource;
			hoveredRegions.setData({
				type: "FeatureCollection",
				features: []
			});

			this.#hoveredRegionFeature = undefined;
		});


		/// RIVERS
		map.on('mousemove', 'riverapp-rivers', (e) => {
			// console.log('mousemove', e.features);

			if (e.features && e.features.length > 0) {
				const feature = e.features[0];
				const hoveredRivers = map.getSource("riverapp-hovered-rivers") as ml.GeoJSONSource;
				// const sourceHoveredFeature = hoveredRegions.
				const hoveredRiversData = hoveredRivers._data as GeoJSON.FeatureCollection<GeoJSON.Geometry>;
				const hoveredRiversFeature = hoveredRiversData.features[0];

				if (this.#hoveredRiverFeature && this.#hoveredRiverFeature.id === feature.id) {
					return;
				}

				hoveredRivers.setData({
					type: "FeatureCollection",
					// features: e.features
					features: [feature]
				});
				this.#hoveredRiverFeature = feature;
				// console.log('hoveredRiver', this.#hoveredRiverFeature);
				this.riverHovered(feature.id as number);

			}
		});

		map.on('mouseleave', 'riverapp-rivers', (e) => {

			const hoveredRivers = map.getSource("riverapp-hovered-rivers") as ml.GeoJSONSource;
			hoveredRivers.setData({
				type: "FeatureCollection",
				features: []
			});

			this.#hoveredRiverFeature = undefined;
			// console.log('hoveredRiver', this.#hoveredRiverFeature);
			this.riverHovered(undefined);

		});
	}

}

// onMount(() => {
// 	console.log("mlmap", mlMapComponent);
// 	mapSelectionMode.mode = "river";
// });