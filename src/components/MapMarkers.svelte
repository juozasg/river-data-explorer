<script lang="ts">
  import * as d3 from "d3";

  import  MapMarker  from "./MapMarker.svelte";
  import { Site, sites, selectedSeries, dataLoaded, getSiteRadius, getSiteColor } from "../lib/stores";
  import { scales, radiusRange } from "../lib/definitions";
  import { model } from "../lib/data/model";
  import { identifyFeatures } from "esri-leaflet";

  export let map: L.Map;

  type Marker = Site & { radius: number, color: string }
  let markers: Marker[];

  // $: {
  //   markers = [];

  //   if($dataLoaded) {
  //     $sites.forEach(site => {
  //       const markerSymbolization = getMarkerSymbolization(site.id, $selectedSeries);

  //       if(markerSymbolization) {
  //         markers = [...markers, {
  //           ...site,
  //           ...markerSymbolization
  //         }]
  //       }
  //     });
  //   }
  // }

  // // return color and radius if a value for this site and series exist
  // function getMarkerSymbolization(siteId: string, seriesId: string) {
  //   const value = model.getValue(siteId, seriesId);
  //   if(value !== undefined) {


  //     return {
  //       color: color,
  //       radius: 
  //     };
  //   }
  // }


</script>

<div id=markers>
  {#if $dataLoaded}
    {#each $sites as site}
      <MapMarker
        map={map}
        id={site.id}
        lat={site.lat}
        lon={site.lon}
        radius={getSiteRadius(site.id, $selectedSeries)}
        color={getSiteColor(site.id, $selectedSeries)}/>
    {/each}
  {/if}
</div>
