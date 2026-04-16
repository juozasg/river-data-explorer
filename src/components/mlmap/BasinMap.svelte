<script lang="ts">
	import * as ml from "maplibre-gl";

	import { sites } from "$src/appstate/data/sites.svelte";
	import { MapHoverSelectionController } from "$src/appstate/map/mapHoverSelectionController.svelte";
	import { nowRoundedToNearest15Minutes } from "$src/lib/utils/date";
	import DataMapControls from "./DataMapControls.svelte";
	import MapLibreMap from "./MapLibreMap.svelte";
	import MapTooltip from "./MapTooltip.svelte";
	import { setOverlayerLayer, updateSiteStyles } from "$src/lib/data/map/layers/updateMapStyles";
	import WaterFlowMarkers from "./WaterFlowMarkers.svelte";
	import { layerParams } from "$src/appstate/ui/layers.svelte";
	import { varstate } from "$src/appstate/map/mapvarstate.svelte";

	// svelte-ignore non_reactive_update
	let mlMapComponent: MapLibreMap;
	let dataMapControls: DataMapControls;

	let mapController: MapHoverSelectionController | undefined = $state();
	let mlMap = $state<ml.Map>();


	let clientWidth = $state(0);

	const tooltipSite = $derived(mapController?.hoveredSite);
	const tooltipRegionObject = $derived(mapController?.hoveredRegionBasinObject);


	$effect(() => {
		if (!mlMapComponent.styleLoaded()) return;

		// selection and hover controller
		if (!mapController) {
			mapController = new MapHoverSelectionController(mlMapComponent.mlmMap()!, () => {
				updateSiteStyles(mlMap!, varstate.varname, varstate.vardate);
			});
		}

		mlMap = mlMapComponent.mlmMap()!;
	});

	// update site markers when varstate changes
	$effect(() => {
		if (mapController && mapController.dataModelReady && mlMap) {
			updateSiteStyles(mlMap, varstate.varname, varstate.vardate);
		}
	});

	// DEBUG
	$effect(() => {
		// console.log("FX BasinMap vardate", varstate.vardate);
		// dataMapControls.setDate(varstate.vardate);
		// if(mapController && mapController.dataModelReady) {
		// 		basinObject1.set('site', 10002);
		// 		chartYSelection.set(basinObject1, 'ecoli');
		// }
	});

	$effect(() => {
		if(mlMap) setOverlayerLayer(mlMap, layerParams.rasterLayer);
	});
</script>

<div class="basin-map" bind:clientWidth>
	<DataMapControls
		sites={[...sites.values()]}
		bind:varname={varstate.varname}
		bind:vardate={varstate.vardate}
		mapWidth={clientWidth}
		bind:this={dataMapControls} />

	<MapLibreMap bind:this={mlMapComponent} />

	{#if mlMap && layerParams.waterflowLayer === "rtflow"}
		<WaterFlowMarkers map={mlMap} varname={layerParams.waterflowLayer} vardate={varstate.vardate} />
	{/if}

	{#if mlMap}
		<MapTooltip
			site={tooltipSite}
			regionObject={tooltipRegionObject}
			{mlMap}
			varname={varstate.varname}
			vardate={varstate.vardate} />
	{/if}
</div>

<style>
</style>
