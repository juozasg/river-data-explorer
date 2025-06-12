<script lang="ts">
	import * as ml from "maplibre-gl";

	import { sites } from "$src/appstate/data/sites.svelte";
	import { MapHoverSelectionController } from "$src/appstate/map/mapHoverSelectionController.svelte";
	import { setEnabledDatasets } from "$src/appstate/ui/layers.svelte";
	import type { Site } from "$src/lib/types/site";
	import { aremove } from "$src/lib/utils/arrays";
	import { todayDate } from "$src/lib/utils/date";
	import MapLibreMap from "./MapLibreMap.svelte";
	import VarDataMarkers from "./VarDataMarkers.svelte";
	import { basinObject1, chartYSelection } from "$src/appstate/selection/basinObjectSelection.svelte";
	import MapTooltip from "./MapTooltip.svelte";

	// svelte-ignore non_reactive_update
	let mlMapComponent: MapLibreMap;

	let mapController: MapHoverSelectionController | undefined = $state();
	let mlMap = $state<ml.Map>();

	let varname = $state<string>("ecoli");

	const onSiteHovered = (site?: Site) => {
		if (mapController) mapController.siteHovered(site);
	};

	const tooltipSite = $derived(mapController?.hoveredSite);
	const tooltipRegionObject = $derived(mapController?.hoveredRegionBasinObject);

	const selectedSites = $derived([...sites.values()].filter((s) => s.dataset !== "invert"));

	$effect(() => {
		if (!mlMapComponent.styleLoaded()) return;

		if (!mapController) {
			mapController = new MapHoverSelectionController(mlMapComponent.mlmMap()!);
		}

		mlMap = mlMapComponent.mlmMap()!;
	});

	// DEBUG
	$effect(() => {
		// if(mapController && mapController.dataModelReady) {
		// 		basinObject1.set('site', 10002);
		// 		chartYSelection.set(basinObject1, 'ecoli');
		// }
	});
</script>

<MapLibreMap bind:this={mlMapComponent} />

{#if mlMap}
	<MapTooltip site={tooltipSite} regionObject={tooltipRegionObject} {mlMap} {varname} vardate={todayDate} />

	<VarDataMarkers
		{mlMap}
		{varname}
		vardate={todayDate}
		sites={selectedSites}
		ghostSitesVisible={true}
		yVarSite={undefined}
		zVarSite={undefined}
		{onSiteHovered} />
{/if}

<style>
</style>
