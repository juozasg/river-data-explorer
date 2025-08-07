<script lang="ts">
	import * as ml from "maplibre-gl";
	import { chartYSelection, chartZSelection } from "$src/appstate/selection/objectDataSelections.svelte";
	import { chartYColor, chartZColor } from "$src/lib/utils/colors";
	import GraphVarHint from "./GraphVarHint.svelte";

	type Props = {
		map: ml.Map;
		varname: string; // variable in map dropdown
	};

	let { map, varname }: Props = $props();

	const ySite = $derived(
		chartYSelection.basinObject.objectType == 'site' ? chartYSelection.basinObject.sites[0] : undefined
	);
	const zSite = $derived(
		chartZSelection.basinObject.objectType == 'site' ? chartZSelection.basinObject.sites[0] : undefined
	);
	// const zSites = $derived(chartZSelection.basinObject.sites.filter((s) => siteHasData(s, varname)));
</script>

<div class="markers">
	{#if ySite}
		{@const site = ySite}
		{#key site.id}
			<GraphVarHint {map} color={chartYColor} lon={site.lon} lat={site.lat} offsetX={-14} />
		{/key}
	{/if}

	{#if zSite}
		{@const site = zSite}
		{#key site.id}
			<GraphVarHint {map} color={chartZColor} lon={site.lon} lat={site.lat} offsetX={14} />
		{/key}
	{/if}
</div>

<!-- {#if zSites && zSites.length > 0}
	{#each zSites as site (site.id)}
		<GraphVarHint {map} color="purple" lon={site.lon} lat={site.lat} offsetX={15} />
	{/each}
{/if} -->

<style>
	.markers {
		position: absolute;
		top: 0;
		left: 0;
		pointer-events: none;
	}
</style>
