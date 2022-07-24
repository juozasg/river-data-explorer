<script lang="ts">
  import  MapMarker  from "./MapMarker.svelte";
  import { Site, sites, selectedSeries, dataLoaded } from "../lib/stores";

  export let map: L.Map;

  type Marker = Site & { radius: number, color: string }
  let markers: Marker[];
</script>

<div id=markers>
  {#each $sites as site}
    <MapMarker
      map={map}
      id={site.id}
      lat={site.lat}
      lon={site.lon}/>
  {/each}
</div>
