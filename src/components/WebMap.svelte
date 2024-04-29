<script lang="ts">

  import { createMaptilerMap as createMaplibreMap } from '$lib/maplibre';
	import { mapMouseLocation } from '$src/state/mapMouse.svelte';
	import { copyLngLat, formatLngLat } from './copyLngLat';

  // TODO: embed with and height. refactor
  // let {width = "100vw", height = "100vh"} = $props();

  const { height = "500px", width = "100%" } = $props();

  let mapContainer: HTMLDivElement | null = $state(null);

  $effect(() => {
    if(mapContainer) createMaplibreMap(mapContainer);
  });


</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div style="position: relative">
  <div class="map" bind:this={mapContainer}></div>
  {#if mapMouseLocation.lngLat}
    <pre>{formatLngLat(mapMouseLocation.lngLat)} press C to copy</pre>
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
    left: 0;
    z-index: 2;
    background: none;
    padding: 0.5rem;
  }
</style>