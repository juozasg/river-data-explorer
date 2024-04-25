<script lang="ts">
  import * as maptilersdk from '@maptiler/sdk';
  import { createMaptilerMap } from '$lib/maplibre';

  // TODO: embed with and height. refactor
  // let {width = "100vw", height = "100vh"} = $props();

  let mapContainer: HTMLDivElement | null = $state(null);

  $effect(() => {
    if(mapContainer) createMaptilerMap();
  });

  </script>



  <div class="map" id="map" bind:this={mapContainer}></div>

  <style>
    #map {
      /* position: absolute; */
      /* top: 0; */
      /* bottom: 0; */
      height: 500px;
      width: 100%;
      z-index: 1;
    }
  </style>