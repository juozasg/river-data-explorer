<script lang="ts">
  import Map from './components/Map.svelte';
  import WindowSelector from './components/WindowSelector.svelte';
  import DataSelector from './components/DataSelector.svelte';
  import DataTable from './components/DataTable.svelte';
  import Timeseries from './components/Timeseries.svelte';
  import Loader from './components/Loader.svelte';
</script>


<main>
  <Map/>
  <DataSelector/>
  <Timeseries/>
  <DataTable/>
  <WindowSelector/>
  <Loader/>
</main>
