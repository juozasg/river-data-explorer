import { initMapData } from '$src/lib/data/map/layers/initMapData';
import { autoSelectBasinObjectsOnClick } from '$src/lib/data/selectionHelpers';
import type { Site } from '$src/lib/types/site';
import * as ml from 'maplibre-gl';
import { findRiverappFeatureById, basinFeatureCollections } from '../data/basinFeatureCollection.svelte';
import { sites } from '../data/sites.svelte';
import { mapSelectionMode, mapSelectionTargetObject } from '../selection/basinObjectSelection.svelte';
import { setSelectedPanel } from '../ui/layout.svelte';
import { setMapCursor } from './mapMouse.svelte';

export type HoveredRegionType = 'huc8' | 'huc10' | 'huc12' | 'county';

export class MapHoverSelectionController {
	#map: ml.Map;
	// #hoveredRegionFeature = $state<ml.MapGeoJSONFeature>();

	// #hoveredRiverFeature = $state<GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>>();
	#hoveredSite = $state<Site>();
	#hoveredRiverId = $state<number>();
	#hoveredRegionId = $state<number>();
	// #hoveredRegionType = $state<HoveredRegionType>();
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

			// set mlm rivers data source when ready
			$effect(() => {
				// this will run when the map data model (sources and layers) is ready and when the feature collections change
				const riversFeatures = basinFeatureCollections.get('river');
				const riversSource = this.#map.getSource("riverapp-rivers") as ml.GeoJSONSource;
				if (this.dataModelReady && riversSource && riversFeatures) {
					// console.log('adding rivers geojson mlmap source data');
					riversSource.setData(riversFeatures);
				}
			});


			// set huc12, huc10 and county regions data source when select mode is set to huc12, huc10 or county
			// and the features are ready
			$effect(() => {
				const huc12Features = basinFeatureCollections.get('huc12');
				if (this.dataModelReady && huc12Features && mapSelectionMode.mode === 'huc12') {
					const regionsSource = this.#map.getSource("riverapp-regions") as ml.GeoJSONSource;
					regionsSource.setData(huc12Features);
					this.#map.redraw();
				}
			});

			$effect(() => {
				const huc10Features = basinFeatureCollections.get('huc10');
				if (this.dataModelReady && huc10Features && mapSelectionMode.mode === 'huc10') {
					const regionsSource = this.#map.getSource("riverapp-regions") as ml.GeoJSONSource;
					regionsSource.setData(huc10Features);
					this.#map.redraw();

				}
			});

			$effect(() => {
				const countiesFeatures = basinFeatureCollections.get('county');
				if (this.dataModelReady && countiesFeatures && mapSelectionMode.mode === 'county') {
					const regionsSource = this.#map.getSource("riverapp-regions") as ml.GeoJSONSource;
					regionsSource.setData(countiesFeatures);
					this.#map.redraw();

				}
			});

			// clear regions when mode is not set to huc12, huc10 or county
			$effect(() => {
				if (this.dataModelReady && mapSelectionMode.mode !== 'huc12' && mapSelectionMode.mode !== 'huc10' && mapSelectionMode.mode !== 'county') {
					const regionsSource = this.#map.getSource("riverapp-regions") as ml.GeoJSONSource;
					regionsSource.setData({
						type: "FeatureCollection",
						features: []
					});
					this.#map.redraw();

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
		if (!site?.id) {
			this.#hoveredSite = undefined;
			if (mapSelectionMode.mode === 'auto' || mapSelectionMode.mode === 'site-catchment') {
				this.clearHoveredRegions();
			}
			setMapCursor('default');
			return;
		}

		this.#hoveredSite = sites.findById(site.id);

		if (mapSelectionMode.mode === 'auto' || mapSelectionMode.mode === 'site-catchment') {
			const siteCatchment = findRiverappFeatureById('site-catchment', site.id);
			// console.log('siteCatchment', siteCatchment);

			if (siteCatchment) {
				const hoveredRegions = this.#map.getSource("riverapp-hovered-regions") as ml.GeoJSONSource;
				hoveredRegions.setData({
					type: "FeatureCollection",
					features: [siteCatchment]
				});
			}
		}

		if (mapSelectionMode.mode === 'site' || mapSelectionMode.mode === 'site-catchment' || mapSelectionMode.mode === 'auto') {
			setMapCursor('pointer');
		}
	}

	riverHovered(id: number | undefined) {
		this.#hoveredRiverId = id;

		// in auto mode site takes precedence over river catchment
		if (mapSelectionMode.mode === 'river-catchment' || (mapSelectionMode.mode === 'auto' && !this.#hoveredSite)) {
			if (id) {
				setMapCursor('pointer');

				const riverCatchment = findRiverappFeatureById('river-catchment', id);
				// console.log('riverCatchment', riverCatchment);

				if (riverCatchment) {
					const hoveredRegions = this.#map.getSource("riverapp-hovered-regions") as ml.GeoJSONSource;
					hoveredRegions.setData({
						type: "FeatureCollection",
						features: [riverCatchment]
					});
				}

			} else {
				this.clearHoveredRegions();
				setMapCursor('default');
			}
		}
	}

	regionHovered(regionId: number | undefined) {
		this.#hoveredRegionId = regionId;

		this.#hoveredRegionId ? setMapCursor('pointer') : setMapCursor('default');
	}



	addHoverListeners(map: ml.Map) {
		map.on('click', (e) => {
			const selectionPanel = `data${mapSelectionMode.target}` as 'data1' | 'data2';
			switch (mapSelectionMode.mode) {
				case 'auto':
					autoSelectBasinObjectsOnClick(this.#hoveredSite, this.#hoveredRiverId);
					setSelectedPanel(selectionPanel);
					break;
				case 'site':
					if (this.#hoveredSite) {
						mapSelectionTargetObject().set('site', this.#hoveredSite.id);
						setSelectedPanel(selectionPanel);
						mapSelectionMode.mode = 'auto';
						mapSelectionMode.target = '2'; // reset target to 1 after selection
					}
					break;
				case 'site-catchment':
					if (this.#hoveredSite) {
						mapSelectionTargetObject().set('site-catchment', this.#hoveredSite.id);
						setSelectedPanel(selectionPanel);
						mapSelectionMode.mode = 'auto';
						mapSelectionMode.target = '2'; // reset target to 1 after selection
					}

					break;
				case 'river-catchment':
					if (this.#hoveredRiverId) {
						mapSelectionTargetObject().set('river-catchment', this.#hoveredRiverId);
						setSelectedPanel(selectionPanel);
						mapSelectionMode.mode = 'auto';
						mapSelectionMode.target = '2'; // reset target to 1 after selection
					}
					break;
				case 'county':
				case 'huc10':
				case 'huc12':
					if (this.#hoveredRegionId) {
						mapSelectionTargetObject().set(mapSelectionMode.mode, this.#hoveredRegionId);
						setSelectedPanel(selectionPanel);
					}
					mapSelectionMode.mode = 'auto';
					mapSelectionMode.target = '2'; // reset target to 1 after selection
					break;
			}
			// basinObject1.set('site', this.#hoveredSite.id);

		});

		/// HOVERED REGIONS

		map.on('mousemove', 'riverapp-regions-fill', (e) => {
			if (e.features && e.features.length > 0) {
				const feature = e.features[0];
				// // console.log('hovered region', feature);
				if (this.#hoveredRegionId === feature.id) {
					return;
				}


				const hoveredRegions = map.getSource("riverapp-hovered-regions") as ml.GeoJSONSource;
				hoveredRegions.setData({
					type: "FeatureCollection",
					features: [feature]
				});

				this.regionHovered(feature.id as number | undefined);
			}

		});

		map.on('mouseleave', 'riverapp-regions-fill', (e) => {
			this.clearHoveredRegions();
			this.regionHovered(undefined);
		});

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

				// highlight the hovered river if map is in river selection mode
				if (mapSelectionMode.mode === 'auto' && this.#hoveredSite === undefined || mapSelectionMode.mode === 'river-catchment') {
					const geojsonFeature = findRiverappFeatureById('river', feature.id as number);

					if (geojsonFeature) {
						hoveredRivers.setData({
							type: "FeatureCollection",
							features: [geojsonFeature]
						});
					}
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
