<script lang="ts">
  import * as L from 'leaflet';

  import { toggleSiteSelection, selectedSites, selectedSeries } from "../lib/stores";
  import { getSiteRadius, getSiteColor, getSiteSelectedColor } from '../lib/symbolization';


  export let map: L.Map;
  export let id: string;
  export let lat: number, lon: number;

  let radius: number;
  let color: string | undefined;
  let selectedColor: string;


  $: {
    color = getSiteColor(id, $selectedSeries);
    radius = getSiteRadius(id, $selectedSeries);
    // console.log(id, color, radius);

    if(color) {
      selectedColor = getSiteSelectedColor(color);
    }
  }

  function createMarker(svgElement: HTMLDivElement) {
    const icon = L.divIcon({html: svgElement, iconAnchor: [20,20], className: 'river-divicon'});
    const marker = L.marker([lat, lon], {icon: icon});
    marker.addTo(map);

    return {
      destroy() {
        map.removeLayer(marker);
      }
    };
  }
</script>

<div id=markers>
  <div use:createMarker style="overflow: visible; pointer-events: none">
    {#if color}
      <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" style="overflow: visible; pointer-events: none">
        <defs>
          <pattern id="stripes-{id}" patternUnits="userSpaceOnUse" width="5.5" height="5.5" patternTransform="rotate(45)">
            <line x1="0" y="0" x2="0" y2="5.5" stroke="{selectedColor}" stroke-width="5" />
          </pattern>
        </defs>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <circle style='cursor: pointer; pointer-events:visible' cy=20 cx=20 r={radius} fill="{color}" stroke="black" stroke-width="2" on:click|stopPropagation={() => { toggleSiteSelection(id) }}  />
        {#if $selectedSites.has(id)}
          <circle cy=20 cx=20 r={radius + 1} stroke="yellow" fill="none" stroke-width="4" stroke-dasharray="2"/>
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <circle style='cursor: pointer' cy=20 cx=20 r={radius} fill="url(#stripes-{id})" opacity="1" on:click|stopPropagation={() => { toggleSiteSelection(id) }} />
        {/if}
      </svg>
    {/if}

  </div>
</div>

<style>
  :global(.river-divicon) {
    width: 0 !important;
    height: 0 !important;
    pointer-events: none !important;

  }
</style>
