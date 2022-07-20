<script lang="ts">
  import * as L from 'leaflet';
  import { onDestroy } from 'svelte';


  import hexToHsl from 'hex-to-hsl';

  import { selectedSites } from "../lib/stores";


  export let map: L.Map;
  export let id: string;
  export let lat: number, lon: number;
  export let radius: number;
  export let color: string;

  let selectedColor;

  $: {
    const colorHsl = hexToHsl(color);
    const invertHsl = [
      (colorHsl[0] + 270) % 360,
      100 - colorHsl[1],
      100 - colorHsl[2]
    ];

    console.log(color, colorHsl, invertHsl);


    selectedColor = `hsl(${invertHsl[0]}, ${invertHsl[1]}%, ${invertHsl[2]}%)`;
  }
  let leafletMarker;
  let selected: boolean;
  $: selected = $selectedSites.includes(id);

  function createMarker(svgElement: HTMLDivElement) {
    const icon = L.divIcon({html: svgElement, iconAnchor: [20,20], className: 'river-divicon'});
    leafletMarker = L.marker([lat, lon], {icon: icon});
    leafletMarker.addTo(map);
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
      $selectedSites = $selectedSites;

      // selected = false;
    }
  }

  onDestroy(() => {
    // if(map.hasLayer(leafletMarker)) {
    map.removeLayer(leafletMarker);
    console.log('destroy MM');

    // }
  });
</script>

<div id=markers>
  <div use:createMarker >
    <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" style="overflow: visible">

      <defs>
        <pattern id="stripes-{id}" patternUnits="userSpaceOnUse" width="5.5" height="5.5" patternTransform="rotate(45)">
          <line x1="0" y="0" x2="0" y2="5.5" stroke="{selectedColor}" stroke-width="5" />
        </pattern>
      </defs>
      <circle style='cursor: pointer' cy=20 cx=20 r={radius} fill="{color}" stroke="black" stroke-width="2" on:click|stopPropagation={toggleSelection}  />
      {#if selected}
        <circle cy=20 cx=20 r={radius + 1} stroke="yellow" fill="none" stroke-width="4" stroke-dasharray="2"/>
        <circle style='cursor: pointer' cy=20 cx=20 r={radius} fill="url(#stripes-{id})" opacity="1" on:click|stopPropagation={toggleSelection} />
      {/if}
    </svg>

  </div>
</div>
