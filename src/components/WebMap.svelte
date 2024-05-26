<script lang="ts">
	import type { LngLatLike } from 'maplibre-gl';

	import { createMap as createMaplibreMap, type MapType } from '$lib/map/createMap';
	import { mapMouseLocation } from '$src/appstate/map/mapMouse.svelte.svelte';
	import { formatLngLat } from '$lib/copyLngLat';
	import { selectedArea } from '$src/appstate/map/hoveredSelectedFeatures.svelte';
	import type MapController from '$src/lib/map/controllers/mapController';
	import SitesMap from '$src/lib/map/controllers/sitesMap';
	import { sites } from '$src/appstate/sites.svelte';

	interface Props {
		type: MapType;
		zoom?: number;
		center?: LngLatLike;
	}
	const { type = 'areas', zoom, center }: Props = $props();

	let mapContainer: HTMLDivElement | null = $state(null);
	let controller: MapController;

	$effect(() => {
		if (mapContainer) {
			controller = createMaplibreMap(mapContainer, type, zoom, center);
		}
	});

	$effect(() => {
		if (controller instanceof SitesMap) {
			controller.onAreaSelected(selectedArea.feature);
		}
		// console.log(`selected feature effect: ${selectedArea.description}`);
	});

	$effect(() => {
		console.log('sites $state effect');
		if (controller) {
			console.log('sites $state effect SETSITES', sites.all);
			controller.setSites(sites.all);

			// sites.all.forEach((site) => {
			// 	controller.addSite(site);
			// });
		}
	});
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div style="position: relative">
	<div class="map" bind:this={mapContainer}></div>
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
