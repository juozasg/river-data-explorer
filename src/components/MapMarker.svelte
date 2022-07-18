<script lang="ts">
  import * as L from 'leaflet';

  import { selectedSites } from "../lib/stores";



  export let map: L.Map;
  export let id: string;
  export let lat: number, lon: number;
  export let radius: number;
  export let color: string;

  // export let selected: boolean;

  let selected: boolean;
  $: selected = $selectedSites.indexOf(id) > -1;

  function createMarker(svgElement: HTMLDivElement) {
    const icon = L.divIcon({html: svgElement, iconAnchor: [20,20], className: 'river-divicon'});
    L.marker([lat, lon], {icon: icon}).addTo(map);
  }

  function toggleSelection() {
    const i = $selectedSites.indexOf(id);
    if(i === -1) {
      // select
      $selectedSites = [...$selectedSites, id];
      selected = true;
    } else {
      // unselect
      $selectedSites.splice(i, 1);
      selected = false;
    }
  }

</script>

<div id=markers>

  <div use:createMarker >
    <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" style="overflow: visible">
      <defs>
        <pattern id="stripes" patternUnits="userSpaceOnUse" width="5.5" height="5.5" patternTransform="rotate(45)">
          <line x1="0" y="0" x2="0" y2="5.5" stroke="#9D3876" stroke-width="5" />
        </pattern>
      </defs>

      <circle style='cursor: pointer' cy=20 cx=20 r={radius} fill="{color}" stroke="black" stroke-width="2" on:click|stopPropagation={toggleSelection}  />
      {#if selected}
        <circle cy=20 cx=20 r={radius + 1} stroke="purple" fill-opacity=0 stroke-width="2" stroke-dasharray="2"/>
        <circle style='cursor: pointer' cy=20 cx=20 r={radius} fill="url(#stripes)" on:click|stopPropagation={toggleSelection} />
      {/if}

  </svg>

  </div>
</div>
