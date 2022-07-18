<script lang="ts">
  import  MapMarker  from "./MapMarker.svelte";
  import { sites } from "../lib/stores";

  export let map: L.Map;

  const site = $sites['site01'];

  let selected = true;

  const markers = [
    {
      id: 'site01',
      lat: 41.55,
      lon: -85.8,
      // selected: false,
      radius: 12,
      color: '#CDBF5B'
    }
  ];


</script>

<div id=markers>
  {#each markers as m}
    <MapMarker
      map={map}
      id={m.id}
      lat={m.lat}
      lon={m.lon}
      radius={m.radius}
      color={m.color}/>
  {/each}
</div>
