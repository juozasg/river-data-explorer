<script lang="ts">
  import Map from './components/Map.svelte';
  import WindowSelector from './components/WindowSelector.svelte';
  import DataSelector from './components/DataSelector.svelte';
  import DataTable from './components/DataTable.svelte';
  import TimeSeries from './components/TimeSeries.svelte';


  let z = false;
</script>


<main>
  <WindowSelector/>
  <Map/>
  <DataSelector/>
</main>
