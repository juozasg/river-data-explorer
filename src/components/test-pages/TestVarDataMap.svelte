<script lang="ts">
	import { DataSelectionState } from "$src/appstate/data/dataSelection.svelte";
	import { sites } from "$src/appstate/sites.svelte";
	import VarDataMap from "$src/components/maps/VarDataMap.svelte";
	import type { Site } from "$src/lib/types/site";
	import { onMount } from "svelte";

	let selectedSite = $state<Site>();

	let varDataMap = $state<VarDataMap>();

	$effect(() => {
		// console.log("TEST selectedSite", selectedSite);
	});

	$effect(() => {
		const s = sites.allEnabled.find((s) => s.id === "sjrbc-1");
		if (s) {
			// selectedSite = s;
		}
	});

	onMount(() => {
		(window as any).varDataMap = varDataMap;
		console.log('TEST varDataMap', varDataMap);
	});
</script>

<!-- <div style="height: 1000px;"></div> -->
<div style="position: relative; height: 500px; width: 550px; margin: 2rem">
	<VarDataMap
		{selectedSite}
		dataSelection={new DataSelectionState()}
		bind:this={varDataMap}
		onMapClick={() => {
			console.log("Map clicked", varDataMap?.hoveredSite());
			if (varDataMap?.hoveredSite()) {
				selectedSite = varDataMap?.hoveredSite();
			}
		}}
		onSearchItemSelect={(item: Site) => {
			console.log("TEST Search item selected", item);
			selectedSite = item;
		}} />
</div>


<span class="map-attribution"> Map Sources: Esri, TomTom, Garmin, FAO, NOAA, USGS, © OpenStreetMap contributors, and the GIS User Community</span>

<style>
	.map-attribution {
		position: fixed;
		bottom: 0;
		left: 0;
		font-size: 0.8rem;
		background-color: white;
		color: #555;
		/* padding: 0.5rem; */
		margin: 0;
		padding: 0;
		margin-left: 0.5rem;
		/* overflow: scroll; */

	}
</style>
