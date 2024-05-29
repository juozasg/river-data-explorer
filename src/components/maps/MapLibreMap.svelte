<script lang="ts">
	import * as maptilersdk from '@maptiler/sdk';

	import { formatLngLat } from '$lib/copyLngLat';
	import { mapMouseLocation } from '$src/appstate/map/mapMouse.svelte';
	import { listenMouseMoveCoordinates } from '$src/lib/map/mouseMoveCoordinates';
	import type { MapLibreMapProps } from '$src/lib/types/components';
	import { onMount } from 'svelte';
	import LayerSwitcher from './LayerSwitcher.svelte';
	import { toggleRiverLayerVisibility } from '$src/lib/map/addSourcesLayers';
	import { onceIdle } from '$src/lib/utils/maplibre';

	let {
		zoom = 8,
		center = [-85.616, 41.825],
		loadData,
		divElement = $bindable(),
		mlMap = $bindable()
	}: MapLibreMapProps = $props();

	let baseStyleId: 'TOPO' | 'SATELLITE' = $state('TOPO');
	let showRiverLayer = $state(false);
	let dataLoaded = $state(false);


	$effect(() => {
		console.log('FX show river layer', showRiverLayer, dataLoaded, mlMap)
		if (!mlMap || !dataLoaded) return;
		toggleRiverLayerVisibility(mlMap, showRiverLayer);
	});


	$effect(() => {
		if (!mlMap) return;

		const style = maptilersdk.MapStyle[baseStyleId];
		(mlMap as maptilersdk.Map).setStyle(style);
		dataLoaded = false;

		// reapply sources and layers
		mlMap.once('idle', async () => {
			loadData(mlMap!);
			await onceIdle(mlMap);
			console.log('MLM once idle showRiver', showRiverLayer)
			toggleRiverLayerVisibility(mlMap, showRiverLayer);

			dataLoaded = true;
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

		setTimeout(() => {
			const attribCtrl = divElement!.querySelectorAll('details.maplibregl-ctrl-attrib');
			attribCtrl.forEach((ctrl) => {
				ctrl.classList.remove('maplibregl-compact-show');
			});
		}, 1000);
	});
</script>


<LayerSwitcher bind:baseStyleId bind:showRiverLayer />

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
