<script lang="ts">

  import pkg from 'maplibre-gl';
  const {Map, NavigationControl, GeolocateControl, ScaleControl, AttributionControl} = pkg;

  // import { map } from '$lib/stores';
  // import { PUBLIC_MAPTILER_KEY } from '$env/static/public';

  // TODO: embed with and height. refactor
  // let {width = "100vw", height = "100vh"} = $props();

  let mapContainer: HTMLDivElement | null = $state(null);

  // PUBLIC_MAPTILER_KEY
  const maptilerKey = '4zPvHZlweLbGaEy9LI4Z';


  const init = () => {
    const _map = new Map({
      container: mapContainer!,
      style: `https://api.maptiler.com/maps/topo/style.json?key=${maptilerKey}`,
      center: [-86.24799777882635, 41.68664479708422],
      zoom: 8,
      hash: false,
      attributionControl: false
    });
    _map.addControl(new NavigationControl({}), 'top-right');
    _map.addControl(
    new GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true
    }),
    'top-right'
    );
    _map.addControl(new ScaleControl({ maxWidth: 80, unit: 'metric' }), 'bottom-left');
    _map.addControl(new AttributionControl({ compact: true }), 'bottom-right');


    // map.set(_map);
  };

  $effect(() => {
    if(mapContainer) init();
  });

  </script>


  <h3>MapLibre Web Map</h3>

  <em>embedded mappy map map</em>

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