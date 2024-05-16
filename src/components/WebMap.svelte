<script lang="ts">
	import type { LngLatLike } from 'maplibre-gl';

  import { createMaptilerMap as createMaplibreMap } from '$lib/maplibre/maplibre';
	import { mapMouseLocation } from '$src/state/mapMouse.svelte';
	import { formatLngLat } from '$lib/copyLngLat';
	import { selectedPolygonFeature } from '$src/state/mapPolygon.svelte';

  interface Props { zoom?: number, center?: LngLatLike};
  const { zoom, center }: Props = $props();

  let mapContainer: HTMLDivElement | null = $state(null);

  $effect(() => {
    if(mapContainer) createMaplibreMap(mapContainer, zoom, center);
  });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div style="position: relative">
  <div class="map" bind:this={mapContainer}></div>
  {#if mapMouseLocation.lngLat}
    <pre>{formatLngLat(mapMouseLocation.lngLat, 4)} press C to copy</pre>
  {/if}
  <i>Selected feature: {selectedPolygonFeature.description}</i>
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
    left: 0;
    z-index: 2;
    background: none;
    padding: 0.5rem;
  }
</style>