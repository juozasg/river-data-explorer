<script lang="ts">
  import  MapMarker  from "./MapMarker.svelte";
  import { sites } from "../lib/stores";

  export let map: L.Map;
</script>

<div id=markers>
  {#each Object.values($sites) as site}
    <MapMarker
      map={map}
      id={site.id}
      lat={site.lat}
      lon={site.lon}/>
  {/each}
</div>
