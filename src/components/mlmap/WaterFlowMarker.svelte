<script lang="ts">
	import * as ml from "maplibre-gl";
	import { onDestroy, onMount } from "svelte";
	import type { Site } from "$src/lib/types/site";
	import { layerParams } from "$src/appstate/ui/layers.svelte";
	import { siteRealtimeDatasets } from "$src/appstate/data/datasets.svelte";
	import { tableIndexBeforeDate } from "$src/lib/data/siteTableHelpers";
	import rgb2hex from "rgb2hex";
	import { interpolateVarColor } from "$src/lib/utils/colors";

	type Props = {
		map: ml.Map;
		site: Site;
		vardate: Date;
		varname: 'rtflow' | 'rtexceedance'
	};

	let { map, site, vardate, varname }: Props = $props();

	let marker: ml.Marker | undefined = $state();
	let node: HTMLElement | undefined = $state();

	const table = $derived(siteRealtimeDatasets.get(site.id));

	const valueIndex = $derived(tableIndexBeforeDate(table, vardate));
	const value: number | undefined = $derived(valueIndex !== -1 ? table?.get(varname, valueIndex) : undefined);
	// const color = rgb2hex(interpolateVarColor(varname, value));
	const color = $derived(interpolateVarColor(varname, value));

	$effect(() => {
		if (node && color) {
			node.style.backgroundColor = color;
		}
	});


	onMount(() => {
		marker = new ml.Marker({ element: node }).setLngLat([site.lon, site.lat]).addTo(map);
	});

	onDestroy(() => {
		if (marker) {
			marker.remove();
			marker = undefined;
		}
	});
</script>

<div bind:this={node} class="map-graph-var-hint" style="background-color: white"></div>

<style>
	.map-graph-var-hint {
		position: absolute;
		width: 30px;
		height: 30px;
		/* border-radius: 50%; */
		border: 1px solid black;
	}
</style>
