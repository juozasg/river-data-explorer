<script lang="ts">
	import * as ml from "maplibre-gl";

	import { onMount } from "svelte";
	import MapLibreMap from "../mlmap/MapLibreMap.svelte";
	import { defineGlobal } from "$src/lib/utils";
	import { regionFeatures } from "$src/appstate/data/regionFeatures.svelte";
	import { loadGeometries_old } from "$src/lib/data/map/layers/mapSources";
	import { mapSelectionMode } from "$src/appstate/selection/objectInteractionState.svelte";
	import { loadRiverappFeatureCollections } from "$src/appstate/data/riverappFeatureCollections";
	import { setBasemapStyleId } from "$src/appstate/ui/layers.svelte";
	import { MLMapController } from "$src/appstate/map/mlmapController.svelte";
	import VarDataMarkers from "../mlmap/VarDataMarkers.svelte";


	// svelte-ignore non_reactive_update
	let mlMapComponent: MapLibreMap;
	let hoveredFeature = $state<ml.MapGeoJSONFeature>();

	let mapController: MLMapController | undefined;
	let mlMap = $state<ml.Map>();

	loadRiverappFeatureCollections();

	// $effect(() => {
	// 	console.log("hoveredFeature", hoveredFeature);
	// });



	$effect(() => {
		if (!mlMapComponent.styleLoaded()) return;

		mapController = new MLMapController(mlMapComponent.mlmMap()!);

		const map = mlMapComponent.mlmMap()!;
		// defineGlobal("map", map);

		// map.on("load", () => {
		// 	console.log("map load-2");
		// });



		map.on('mousemove', 'riverapp-regions-fill', (e) => {
			// console.log('mousemove', e.features);

			if(e.features && e.features.length > 0) {
				const feature = e.features[0];
				const hoveredRegions = map.getSource("riverapp-hovered-regions") as ml.GeoJSONSource;
				// const sourceHoveredFeature = hoveredRegions.
				const hoveredRegionsData = hoveredRegions._data as GeoJSON.FeatureCollection<GeoJSON.Geometry>;
				const hoveredRegionsFeature = hoveredRegionsData.features[0];

				if(hoveredFeature && hoveredFeature.id === feature.id) {
					return;
				}
				// console.log('hoveredRegions', hoveredRegions);


				hoveredRegions.setData({
					type: "FeatureCollection",
					// features: e.features
					features: [feature]
				});
				hoveredFeature = feature;
			}
		});

		map.on('mouseleave', 'riverapp-regions-fill', (e) => {

			const hoveredRegions = map.getSource("riverapp-hovered-regions") as ml.GeoJSONSource;
			hoveredRegions.setData({
				type: "FeatureCollection",
				features: []
			});

			hoveredFeature = undefined;
		});
	});




	function randomizeFS() {
		const map = mlMapComponent.mlmMap()!;

		const source = map.getSource("sitez") as ml.GeoJSONSource;
		const data = source._data as GeoJSON.FeatureCollection<GeoJSON.Geometry>;

		console.log("_data", data);
		data.features.forEach((feature) => {
			// console.log("feature", feature);
			map.setFeatureState({ source: "sitez", id: feature.id }, { color: randomHexColor(), r: 20 });
		});

		// console.log('map', map);
	}

	function randomizeRegionsSource() {
		const map = mlMapComponent.mlmMap()!;

		// pick random from huc8, huc10, huc12 and county geojson
		// const regionTypes = ["huc8", "huc10", "huc12", "county"];
		const regionTypes = ["huc10", "huc12", "county"];
		const regionType = regionTypes[Math.floor(Math.random() * regionTypes.length)];
		const data = regionFeatures.getFeatureCollection(regionType);

		console.log("regionType setting data", regionType, data);

		// merge huc8, huc10, huc12 and county featureCollections
		const allFeatures = regionTypes.map((rt) => regionFeatures.getFeatureCollection(rt).features).flat();
		console.log("allFeatures", allFeatures);

		const allFeatureCollection = {
			type: "FeatureCollection",
			features: allFeatures,
			name: "allRegions"
		};

		// console.log("featureCollection", featureCollection);

		console.log("data", data);

		const source = map.getSource("riverapp-regions") as ml.GeoJSONSource;
		// source.setData(featureCollection as any);
		source.setData(data as any);

		// const layer = map.getLayer("riverapp-regions-fill");
		// layer?.setLayoutProperty("filter",  ["has", "huc12"]);
		// const data = source._data as GeoJSON.FeatureCollection<GeoJSON.Geometry>;

		// console.log("_data", data);
		// data.features.forEach((feature) => {
		// console.log("feature", feature);
		// map.setFeatureState({ source: "regions", id: feature.id }, { color: randomHexColor(), r: 20 });
		// });

		// console.log('map', map);
	}
</script>

<!-- <div>Panel map</div> -->

<div class="debug-controls">
	<!-- <input type="range" min="1" max="10000" onmousemove={randomizeFS} /> -->
	<!-- <button class="debug" onclick={randomizeFS}>Randomize colors</button> -->
	<button class="debug" onclick={randomizeRegionsSource}>Randomize Regions</button>
	<button class="debug" onclick={() => setBasemapStyleId("TOPO")}>TOPO</button>
	<button class="debug" onclick={() => setBasemapStyleId("SATELLITE")}>SAT</button>
</div>

<MapLibreMap bind:this={mlMapComponent} />

{#if mlMap}
	<VarDataMarkers
		{mlMap}
		{varname}
		{vardate}
		{sites}
		ghostSitesVisible={layersParams.ghostSitesVisible}
		yVarSite={dataSelection.yVar ? dataSelection.ySite : undefined}
		zVarSite={dataSelection.zVar ? dataSelection.zSite : undefined}
		{emphasizedSites}
		{selectedSite}
		bind:hoveredSite={_hoveredSite}
		{...others} />
{/if}

<style>
	.debug-controls {
		position: absolute;
		/* top: 50px; */
		left: 10;
		background-color: rgba(128, 128, 128, 0.289);
		padding: 0.5rem;
		z-index: 1000;
		width: 100vw;
		display: flex;

		gap: 20px;
	}
</style>
