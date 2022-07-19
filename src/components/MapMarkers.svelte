<script lang="ts">
  import * as d3 from "d3";

  import  MapMarker  from "./MapMarker.svelte";
  import { Site, sites, selectedSeries, dataLoaded } from "../lib/stores";
  import { scales, radiusRange } from "../lib/definitions";
  import { model } from "../lib/data/model";

  export let map: L.Map;

  type Marker = Site & { radius: number, color: string }
  let markers: Marker[];

  $: {
    markers = [];

    if($dataLoaded) {
      $sites.forEach(site => {
        const markerSymbolization = getMarkerSymbolization(site.id, $selectedSeries);

        if(markerSymbolization) {
          markers = [...markers, {
            ...site,
            ...markerSymbolization
          }]
        }
      });
    }
  }

  // return color and radius if a value for this site and series exist
  function getMarkerSymbolization(siteId: string, seriesId: string) {
    const value = model.getValue(siteId, seriesId);
    console.log(value);
    if(value !== undefined) {

      const colorScale = scales[seriesId];
      const radiusScale = colorScale.copy().range(radiusRange);

      const color = d3.color(colorScale(value)).formatHex();

      // console.log(color, radiusScale(value));

      return {
        color: color,
        radius: radiusScale(value),
      };
    }
  }


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
