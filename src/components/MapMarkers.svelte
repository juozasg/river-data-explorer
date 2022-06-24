<script lang="ts">
  import * as L from 'leaflet';

  import { sites } from "../lib/stores";

  export let map: L.Map;

  const site = $sites['site01'];
  console.log(site);
  

  let selected = true;

  function createMarker(svgElement) {
    const icon = L.divIcon({html: svgElement, iconAnchor: [20,20], className: 'river-divicon'});
    console.log(icon);
    console.log('bruuuh');
    
    console.log(map);
    
    L.marker([site[0], site[1]], {icon: icon}).addTo(map);
  }

  function toggleSelection(event) {
    console.log('toggle');
    selected = !selected;
  }

</script>

<div id=markers>
  
  <div use:createMarker style="border: 1px dashed orange">
    <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" style='border: 2px dotted aquamarine'>
      <defs>
        <pattern id="stripes" patternUnits="userSpaceOnUse" width="5.5" height="5.5" patternTransform="rotate(45)">
          <line x1="0" y="0" x2="0" y2="5.5" stroke="#9D3876" stroke-width="5" />
        </pattern>
      </defs>

      <circle cy=20 cx=20 r=9 fill="hsl(53,53%,58%)" stroke="black" stroke-width="2"  />
      <circle style='cursor: pointer' cy=20 cx=20 r=9 fill="url(#stripes)" on:click={toggleSelection} />

      <!-- <circle cy=20 cx=20  r=20 fill="hsl(323,47%,42%)" stroke="black" stroke-width="2" /> -->
      <!-- <circle cy=20 cx=20  r=20 fill="url(#stripes)" /> -->
      <!-- <circle r="50"/> -->
  </svg>

  </div>
</div>

<style>



</style>