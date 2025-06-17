<script lang="ts">
	import * as ml from "maplibre-gl";
	import { onDestroy, onMount } from "svelte";

	type Props = {
		map: ml.Map;
		color: string;
		lon: number;
		lat: number;
		offsetX: number;
	};

	let { map, color, lon, lat, offsetX = 0 }: Props = $props();

	let marker: ml.Marker | undefined = $state();
	let node: HTMLElement | undefined = $state();

	onMount(() => {
		marker = new ml.Marker({ element: node }).setLngLat([lon, lat]).addTo(map);
	});

	onDestroy(() => {
		if (marker) {
			marker.remove();
			marker = undefined;
		}
	});
</script>

<div bind:this={node} class="map-graph-var-hint" style="background-color: {color}; left: {offsetX}px"></div>

<style>
	.map-graph-var-hint {
		position: absolute;
		width: 6px;
		height: 30px;
		/* border-radius: 50%; */
		border: 1px solid black;
	}
</style>
