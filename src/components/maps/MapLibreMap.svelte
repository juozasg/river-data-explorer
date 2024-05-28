<script lang="ts">
	import * as maptilersdk from '@maptiler/sdk';
	import type { LngLatLike } from 'maplibre-gl';
	import * as ml from 'maplibre-gl';

	import { createMap as createMaplibreMap, type MapType } from '$lib/map/createMap';
	import { mapMouseLocation } from '$src/appstate/map/mapMouse.svelte';
	import { formatLngLat } from '$lib/copyLngLat';
	import { selectedArea } from '$src/appstate/map/hoveredSelectedFeatures.svelte';
	import type MapController from '$src/lib/map/controllers/mapController';
	import SitesMap from '$src/lib/map/controllers/sitesMap';
	import { sites } from '$src/appstate/sites.svelte';
	import { onMount } from 'svelte';
	import { geometries } from '$src/appstate/data/geometries.svelte';
	import { base } from '$app/paths';
	import { listenMouseMoveCoordinates } from '$src/lib/map/controllers/mouseMoveCoordinates';

	interface Props {
		zoom?: number;
		center?: LngLatLike;
		divElement?: HTMLDivElement;
		mlMap?: ml.Map;
	}

	let {
		zoom = 8,
		center = [-85.616, 41.825],
		divElement = $bindable(),
		mlMap = $bindable()
	}: Props = $props();

	let baseStyleId: 'TOPO' | 'SATELLITE' = $state('TOPO');

	export const test = '123';

	$effect(() => {
		if (!mlMap) return;

		const style = maptilersdk.MapStyle[baseStyleId];

		(mlMap as maptilersdk.Map).setStyle(style);

		// reapply sources and layers
		mlMap.once('idle', () => {
			console.log('map idle');
			// reload
			// this._callback();
			// console.log('map idle reload callback');
		});
	});

	onMount(() => {
		const maptilerKey = '4zPvHZlweLbGaEy9LI4Z';
		maptilersdk.config.apiKey = maptilerKey;

		mlMap = new maptilersdk.Map({
			container: divElement!, // container's id or the HTML element to render the map
			style: maptilersdk.MapStyle.TOPO,
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

	#loading-map {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 2;
		font-size: 3rem;
	}
</style>
