<script lang="ts">
	import * as ml from "maplibre-gl";

	import { onMount } from "svelte";
	import MapLibreMap from "../mlmap/MapLibreMap.svelte";
	import { defineGlobal } from "$src/lib/utils";
	import { regionFeatures } from "$src/appstate/data/regionFeatures.svelte";
	import { loadGeometries_old } from "$src/lib/data/map/layers/mapSources";
	import { mapSelectionMode } from "$src/appstate/selection/objectInteractionState.svelte";
	import { loadRiverappFeatureCollections } from "$src/appstate/data/riverappFeatureCollections";
	import { setBasemapStyleId, setEnabledDatasets } from "$src/appstate/ui/layers.svelte";
	import { MLMapController } from "$src/appstate/map/mlmapController.svelte";
	import VarDataMarkers from "../mlmap/VarDataMarkers.svelte";
	import { sites as globalSites, Sites } from "$src/appstate/data/sites.svelte";
	import { aremove } from "$src/lib/utils/arrays";
	import { todayDate } from "$src/lib/utils/date";
	import type { Site } from "$src/lib/types/site";



	// svelte-ignore non_reactive_update
	let mlMapComponent: MapLibreMap;

	let mapController: MLMapController | undefined;
	let mlMap = $state<ml.Map>();


	const onSiteHovered = (site?: Site) => {
		if(mapController) mapController.siteHovered(site);
	};

	$effect(() => {
		setEnabledDatasets(aremove(globalSites.allDatasets, "invert"));
		// setEnabledDatasets(['sjrbc']);

		console.log('globalSites.allDatasets', globalSites.allDatasets);

	});
	const sites = $derived(globalSites.allEnabled);

	loadRiverappFeatureCollections();

	// $effect(() => {
	// 	console.log("hoveredFeature", hoveredFeature);
	// });



	$effect(() => {
		if (!mlMapComponent.styleLoaded()) return;

		mlMap = mlMapComponent.mlmMap()!;
		mapController = new MLMapController(mlMapComponent.mlmMap()!);

		// defineGlobal("map", mlMap);

		// map.on("load", () => {
		// 	console.log("map load-2");
		// });
	});





</script>

<!-- <div>Panel map</div> -->

<div class="debug-controls">
	<!-- <input type="range" min="1" max="10000" onmousemove={randomizeFS} /> -->
	<!-- <button class="debug" onclick={randomizeFS}>Randomize colors</button> -->
	<!-- <button class="debug" onclick={randomizeRegionsSource}>Randomize Regions</button> -->
	<button class="debug" onclick={() => setBasemapStyleId("TOPO")}>TOPO</button>
	<button class="debug" onclick={() => setBasemapStyleId("SATELLITE")}>SAT</button>
</div>

<MapLibreMap bind:this={mlMapComponent} />

{#if mlMap}
	<VarDataMarkers
		{mlMap}
		varname='ecoli'
		vardate={todayDate}
		{sites}
		ghostSitesVisible={true}
		yVarSite={undefined}
		zVarSite={undefined}
		{onSiteHovered}
 />
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
