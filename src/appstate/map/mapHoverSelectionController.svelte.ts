import * as ml from 'maplibre-gl';
import { initMapData } from '$src/lib/data/map/layers/initMapData';
import type { Site } from '$src/lib/types/site';
import { riverappFeatureCollections } from '../data/riverappFeatureCollections';
import { basinObject1, basinObject2, mapSelectionMode } from '../selection/selectionsState.svelte';
import { sites } from '../data/sites.svelte';
import { autoSelectBasinObjectsOnClick } from '$src/lib/data/selectionHelpers';

export type HoveredRegionType = 'huc8' | 'huc10' | 'huc12' | 'county';

export class MapHoverSelectionController {
	#map: ml.Map;
	// #hoveredRegionFeature = $state<ml.MapGeoJSONFeature>();

	// #hoveredRiverFeature = $state<GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>>();
	#hoveredSite = $state<Site>();
	#hoveredRiverId = $state<number>();
	#hoveredRegionId = $state<number>();
	#hoveredRegionType = $state<HoveredRegionType>();
	// #hoveredSite

	dataModelReady = $state(false)

	// map initial style has been loaded. it is now safe to add layers
	constructor(map: ml.Map) {
		this.#map = map;

		console.log('init mlmapController', map);

		initMapData(map);

		map.once("idle", () => {
			// console.log("mlmap data model is ready");
			this.dataModelReady = true;
			this.addHoverListeners(map);
			// now safe to modify map sources and layers
		});

		$effect.root(() => {

			// $effect(() => {
			// 	console.log('hoveredregion', this.#hoveredRegionFeature);

			// });
			$effect(() => {
				// this will run when the map data model (sources and layers) is ready and when the feature collections change
				const riversFeatures = riverappFeatureCollections.get('rivers');
				const riversSource = this.#map.getSource("riverapp-rivers") as ml.GeoJSONSource;
				if (this.dataModelReady && riversSource && riversFeatures) {
					// console.log('adding rivers geojson mlmap source data');
					riversSource.setData(riversFeatures);
				}
			});
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

		if (site && site.id) {
			const catchments = riverappFeatureCollections.get('site-catchments');
			if (catchments) {
				const siteCatchment = catchments.features.find(f => f.properties?.id === site.id);
				console.log('siteCatchment', siteCatchment);

				if (siteCatchment) {
					const hoveredRegions = this.#map.getSource("riverapp-hovered-regions") as ml.GeoJSONSource;
					hoveredRegions.setData({
						type: "FeatureCollection",
						features: [siteCatchment]
					});
				}
			}
			this.#hoveredSite = sites.findById(site.id);
		} else {
			this.clearHoveredRegions();
			this.#hoveredSite = undefined;
		}
	}

	riverHovered(id: number | undefined) {
		this.#hoveredRiverId = id;
		// in auto mode site takes precedence over river catchment
		if (mapSelectionMode.mode === 'river-catchment' || (mapSelectionMode.mode === 'auto' && !this.#hoveredSite)) {
			if (id) {
				const catchments = riverappFeatureCollections.get('river-catchments');

				if (catchments) {
					const riverCatchment = catchments.features.find(f => f.properties?.id === id);
					console.log('riverCatchment', riverCatchment);

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
	}



	addHoverListeners(map: ml.Map) {

		map.on('click', (e) => {
			if (mapSelectionMode.mode == 'auto') {
				// select a site  into data1 if one is hovered, and a catchment into data2 if data 2 is empty

				autoSelectBasinObjectsOnClick(this.#hoveredSite, this.#hoveredRiverId);
			};
		});

		// TODO: hucs and counties selection
		// map.on('mousemove', 'riverapp-regions-fill', (e) => {
		// 	// console.log('mousemove', e.features);

		// 	if (e.features && e.features.length > 0) {
		// 		const feature = e.features[0];
		// 		const hoveredRegions = map.getSource("riverapp-hovered-regions") as ml.GeoJSONSource;
		// 		// const sourceHoveredFeature = hoveredRegions.
		// 		const hoveredRegionsData = hoveredRegions._data as GeoJSON.FeatureCollection<GeoJSON.Geometry>;
		// 		// const hoveredRegionsFeature = hoveredRegionsData.features[0];

		// 		if (this.#hoveredRegionFeature && this.#hoveredRegionFeature.id === feature.id) {
		// 			return;
		// 		}
		// 		// console.log('hoveredRegions', hoveredRegions);


		// 		hoveredRegions.setData({
		// 			type: "FeatureCollection",
		// 			// features: e.features
		// 			features: [feature]
		// 		});
		// 		this.#hoveredRegionFeature = feature;
		// 	}
		// });

		// map.on('mouseleave', 'riverapp-regions-fill', (e) => {

		// 	const hoveredRegions = map.getSource("riverapp-hovered-regions") as ml.GeoJSONSource;
		// 	hoveredRegions.setData({
		// 		type: "FeatureCollection",
		// 		features: []
		// 	});

		// 	this.#hoveredRegionFeature = undefined;
		// });


		/// RIVERS
		map.on('mousemove', 'riverapp-rivers-hitbox', (e) => {
			// console.log('mousemove', e.features);

			if (e.features && e.features.length > 0) {
				const feature = e.features[0];
				const hoveredRivers = map.getSource("riverapp-hovered-rivers") as ml.GeoJSONSource;
				// const hoveredRiversData = hoveredRivers._data as GeoJSON.FeatureCollection<GeoJSON.Geometry>;
				// const hoveredRiversFeature = hoveredRiversData.features[0];

				if (this.#hoveredRiverId === feature.id) {
					return;
				}

				const geojsonFeature = riverappFeatureCollections.get('rivers')?.features.find(f => f.properties && f.properties.id === feature.id);

				if (geojsonFeature) {
					hoveredRivers.setData({
						type: "FeatureCollection",
						features: [geojsonFeature]
					});
				}
				this.riverHovered(feature.id as number);
			}
		});

		map.on('mouseleave', 'riverapp-rivers-hitbox', (e) => {

			const hoveredRivers = map.getSource("riverapp-hovered-rivers") as ml.GeoJSONSource;
			hoveredRivers.setData({
				type: "FeatureCollection",
				features: []
			});

			// console.log('hoveredRiver', this.#hoveredRiverFeature);
			this.riverHovered(undefined);

		});
	}

}

// onMount(() => {
// 	console.log("mlmap", mlMapComponent);
// 	mapSelectionMode.mode = "river";
// });