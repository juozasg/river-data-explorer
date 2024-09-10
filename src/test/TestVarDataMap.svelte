<script lang="ts">
	import { sites } from "$src/appstate/sites.svelte";
	import VarDataMap from "$src/components/maps/VarDataMap.svelte";
	import type { Site } from "$src/lib/types/site";
	import { hover } from "@testing-library/user-event/dist/cjs/convenience/hover.js";

	let selectedSite = $state<Site>();

	let varDataMap = $state<VarDataMap>();

	$effect(() => {
		console.log("TEST selectedSite", selectedSite);
	});

	$effect(() => {
		const s = sites.allEnabled.find((s) => s.id === "sjrbc-1");
		if (s) {
			selectedSite = s;
		}
	});
</script>

<!-- <div style="height: 1000px;"></div> -->
<div style="position: relative; height: 500px; width: 500px">
	<VarDataMap {selectedSite} dataSelection={{}} bind:this={varDataMap} mapClick={()=> {
		console.log("Map clicked", varDataMap?.hoveredSite());
		if(varDataMap?.hoveredSite()) {
			selectedSite = varDataMap?.hoveredSite();
		}
	}}/>
</div>
