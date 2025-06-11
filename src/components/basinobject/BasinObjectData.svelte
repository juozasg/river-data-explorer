<script lang="ts">
	import BasinObjectHeader from "./BasinObjectHeader.svelte";

	import type { BasinObject } from "$src/appstate/data/basinObject.svelte";
	import { sitesInRegion } from "$src/appstate/data/geoindexes.svelte";
	import { mapSelectionMode } from "$src/appstate/selection/basinObjectSelection.svelte";
	import SelectModeHint from "./SelectModeHint.svelte";
	import SelectModeSelector from "./SelectModeSelector.svelte";
	import BasinObjectStats from "./stats/BasinObjectStats.svelte";
	import BasinRegionSitesStats from "./stats/BasinRegionSitesStats.svelte";

	type Props = { selectionTarget: "1" | "2"; basinObject: BasinObject };
	const { selectionTarget, basinObject }: Props = $props();
	let showModeSelector = $state(true);

	$effect(() => {
		if (basinObject.isSet) {
			showModeSelector = false;
		}
	});
</script>

<div class={`data-panel data-${selectionTarget}`}>
	{#if basinObject.isSet}
		<BasinObjectHeader {selectionTarget} {basinObject} bind:showModeSelector={showModeSelector} />
	{:else}
		<div>
			<h4>Data {selectionTarget}: Nothing selected</h4>
		</div>
	{/if}

	{#if (mapSelectionMode.mode !== "auto" && mapSelectionMode.target === selectionTarget) || (!basinObject.isSet && mapSelectionMode.target === selectionTarget)}
		<SelectModeHint />
	{/if}

	{#if showModeSelector}
		<SelectModeSelector target={selectionTarget} bind:show={showModeSelector} />
	{/if}

	{#if basinObject.isSet}
		{#if basinObject.objectType && basinObject.objectType !== "site"}
			<BasinRegionSitesStats sites={sitesInRegion(basinObject.objectType, basinObject.id!)} />
		{/if}

		<div class="basin-object-stats">
			<BasinObjectStats {basinObject} />
		</div>
	{/if}
</div>

<style>
	.data-panel {
		padding: 10px;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}


	.basin-object-stats {
		height: calc(100% - 20px);
		overflow: auto;
	}
</style>
