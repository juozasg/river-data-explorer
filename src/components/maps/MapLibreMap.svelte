<script lang="ts">
	import * as maptilersdk from '@maptiler/sdk';
	import type { LngLatLike } from 'maplibre-gl';
	import * as ml from 'maplibre-gl';

	import { formatLngLat } from '$lib/copyLngLat';
	import { mapMouseLocation } from '$src/appstate/map/mapMouse.svelte';
	import { listenMouseMoveCoordinates } from '$src/lib/map/controllers/mouseMoveCoordinates';
	import { onMount } from 'svelte';

	interface Props {
		zoom?: number;
		center?: LngLatLike;
		loadData: (map: ml.Map) => void;

		divElement?: HTMLDivElement;
		mlMap?: ml.Map;
	}

	let {
		zoom = 8,
		center = [-85.616, 41.825],
		loadData,
		divElement = $bindable(),
		mlMap = $bindable()
	}: Props = $props();

	let baseStyleId: 'TOPO' | 'SATELLITE' = $state('TOPO');

	export const test = '123';

	$effect(() => {
		console.log('FX', 'try to set style')
		if (!mlMap) return;

		const style = maptilersdk.MapStyle[baseStyleId];

		(mlMap as maptilersdk.Map).setStyle(style);
		console.log('FX', 'set style!')

		// reapply sources and layers
		mlMap.once('idle', () => {
			console.log('FX map idle ');
			loadData(mlMap!);
		});
	});

	onMount(() => {
		const maptilerKey = '4zPvHZlweLbGaEy9LI4Z';
		maptilersdk.config.apiKey = maptilerKey;

		mlMap = new maptilersdk.Map({
			container: divElement!, // container's id or the HTML element to render the map
			style: maptilersdk.MapStyle[baseStyleId], // style URL
			center, // starting position [lng, lat]
			zoom, // starting zoom
			minZoom: 3
		});

		listenMouseMoveCoordinates(mlMap);
	});
</script>

<select bind:value={baseStyleId}>
	<option value="TOPO">Topo</option>
	<option value="SATELLITE">Imagery</option>
</select>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div style="position: relative">
	<div class="map" bind:this={divElement}>Loading Map...</div>
	{#if mapMouseLocation.lngLat}
		<pre>{formatLngLat(mapMouseLocation.lngLat, 4)} press C to copy</pre>
	{/if}
</div>

<style>
	.map {
		/* position: absolute; */
		/* top: 0; */
		/* bottom: 0; */
		height: var(--map-height, 500px);
		width: var(--map-width, 100%);
		z-index: 1;
	}

	pre {
		position: absolute;
		bottom: 0px;
		left: 110px;
		z-index: 2;
		background: none;
		padding: 0.5rem;
	}

</style>
