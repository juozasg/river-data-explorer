<script lang="ts">
	import * as maptilersdk from '@maptiler/sdk';

	import { formatLngLat } from '$lib/copyLngLat';
	import { mapMouseLocation } from '$src/appstate/map/mapMouse.svelte';
	import { listenMouseMoveCoordinates } from '$src/lib/map/mouseMoveCoordinates';
	import type { MapLibreMapProps } from '$src/lib/types/components';
	import { onMount } from 'svelte';
	import LayerSwitcher from './LayerSwitcher.svelte';
	import { toggleRiverLayerVisibility } from '$src/lib/map/addDataMap';
	import { toggleoffAttribution } from '$src/lib/utils/maplibre';

	let {
		zoom = 8,
		center = [-85.616, 41.825],
		addSources,
		addLayers,
		divElement = $bindable(),
		mlMap = $bindable()
	}: MapLibreMapProps = $props();

	let baseStyleId: 'TOPO' | 'SATELLITE' = $state('TOPO');
	let showRiverLayer = $state(true);

	let mlmFsm:
		| 'init'
		| 'loading-style'
		| 'style-loaded'
		| 'loading-data'
		| 'loaded' = $state('init');

	$effect(() => {
		if(!mlMap) return;

		const style = maptilersdk.MapStyle[baseStyleId];
		(mlMap as maptilersdk.Map).setStyle(style);
		mlmFsm = 'loading-style';
	});

	$effect(() => {
		if(mlmFsm === 'style-loaded') {
			mlmFsm = 'loading-data';
			addSources(mlMap!).then(() => {
				addLayers(mlMap!);
			});
		}
	});


	$effect(() => {
		if (mlmFsm === 'loaded') {
			toggleRiverLayerVisibility(mlMap!, showRiverLayer);
		}
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

		// only fires for the initial style, not for map.setStyle!
		mlMap.on('style.load', () => {
			mlmFsm = 'style-loaded';
		});

		mlMap.on('idle', () => {
			if (mlmFsm === 'loading-style') {
				mlmFsm = 'style-loaded';
			}

			if (mlmFsm === 'loading-data') {
				mlmFsm = 'loaded';
			}
		});

		listenMouseMoveCoordinates(mlMap);
		toggleoffAttribution(divElement!);
	});
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div style="position: relative">
	<LayerSwitcher bind:baseStyleId bind:showRiverLayer />
	<div class="map" bind:this={divElement}>
		<br />
		<br />
		Loading Map...
	</div>
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
