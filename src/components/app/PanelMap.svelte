<script lang="ts">
	import * as ml from "maplibre-gl";

	import { sites } from "$src/appstate/data/sites.svelte";
	import { MapHoverSelectionController } from "$src/appstate/map/mapHoverSelectionController.svelte";
	import { setEnabledDatasets } from "$src/appstate/ui/layers.svelte";
	import type { Site } from "$src/lib/types/site";
	import { aremove } from "$src/lib/utils/arrays";
	import { todayDate } from "$src/lib/utils/date";
	import MapLibreMap from "../mlmap/MapLibreMap.svelte";
	import VarDataMarkers from "../mlmap/VarDataMarkers.svelte";
	import { basinObject1 } from "$src/appstate/selection/basinObjectSelection.svelte";



	// svelte-ignore non_reactive_update
	let mlMapComponent: MapLibreMap;

	let mapController: MapHoverSelectionController | undefined = $state();
	let mlMap = $state<ml.Map>();

	const onSiteHovered = (site?: Site) => {
		if(mapController) mapController.siteHovered(site);
	};


	const selectedSites = $derived([...sites.values()].filter(s => s.dataset !== "invert"));

	$effect(() => {
		if (!mlMapComponent.styleLoaded()) return;

		if(!mapController) {
			mapController = new MapHoverSelectionController(mlMapComponent.mlmMap()!);
		}

		mlMap = mlMapComponent.mlmMap()!;
	});

	// DEBUG
	$effect(() => {
		if(mapController && mapController.dataModelReady) {
				// basinObject1.set('site', 10002);
		}
	});


</script>


<MapLibreMap bind:this={mlMapComponent} />

{#if mlMap}
	<VarDataMarkers
		{mlMap}
		varname='ecoli'
		vardate={todayDate}
		sites={selectedSites}
		ghostSitesVisible={true}
		yVarSite={undefined}
		zVarSite={undefined}
		{onSiteHovered}
 />
{/if}

<style>

</style>
