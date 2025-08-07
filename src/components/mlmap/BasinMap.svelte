<script lang="ts">
	import * as ml from "maplibre-gl";


	import { sites } from "$src/appstate/data/sites.svelte";
	import { MapHoverSelectionController } from "$src/appstate/map/mapHoverSelectionController.svelte";
	import { todayDate } from "$src/lib/utils/date";
	import DataMapControls from "./DataMapControls.svelte";
	import MapLibreMap from "./MapLibreMap.svelte";
	import MapTooltip from "./MapTooltip.svelte";
	import { updateSiteStyles } from "$src/lib/data/map/layers/updateMapStyles";
	import MapGraphVarHints from "./MapGraphVarHints.svelte";
	import WaterFlowMarkers from "./WaterFlowMarkers.svelte";
	import { layerParams } from "$src/appstate/ui/layers.svelte";


	// svelte-ignore non_reactive_update
	let mlMapComponent: MapLibreMap;

	let mapController: MapHoverSelectionController | undefined = $state();
	let mlMap = $state<ml.Map>();

	let varname = $state<string>("ecoli");
	let vardate = $state<Date>(todayDate);

	let clientWidth = $state(0);

	const tooltipSite = $derived(mapController?.hoveredSite);
	const tooltipRegionObject = $derived(mapController?.hoveredRegionBasinObject);

	// const selectedSites = $derived([...sites.values()].filter((s) => s.dataset !== "invert"));
	const selectedSites = $derived([...sites.values()].filter((s) => s));

	$effect(() => {
		if (!mlMapComponent.styleLoaded()) return;

		if (!mapController) {
			mapController = new MapHoverSelectionController(mlMapComponent.mlmMap()!);
		}

		mlMap = mlMapComponent.mlmMap()!;
	});

	// site markers
	$effect(() => {
		if(mapController && mapController.dataModelReady && mlMap) {
			updateSiteStyles(mlMap, varname, vardate);
		}
	});

	// DEBUG
	$effect(() => {
		// if(mapController && mapController.dataModelReady) {
		// 		basinObject1.set('site', 10002);
		// 		chartYSelection.set(basinObject1, 'ecoli');
		// }
	});

</script>


<div class='basin-map' bind:clientWidth>
	<!-- bind:this={dataMapControls}  -->
	<DataMapControls
			sites={[...sites.values()]}
			bind:varname
			bind:vardate
			mapWidth={clientWidth} />


	<MapLibreMap bind:this={mlMapComponent} />

	{#if mlMap && layerParams.waterflowLayer === "rtflow"}
		 <WaterFlowMarkers map={mlMap} varname={layerParams.waterflowLayer} {vardate} />
	{/if}


	{#if mlMap}
		<MapTooltip site={tooltipSite} regionObject={tooltipRegionObject} {mlMap} {varname} vardate={todayDate} />
	{/if}
</div>

<style>
</style>
