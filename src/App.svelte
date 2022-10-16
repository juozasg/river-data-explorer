<script lang="ts">
  // import svelteLogo from './assets/svelte.svg'

  import Map from './components/Map.svelte';
  import WindowSelector from './components/WindowSelector.svelte';
  import Dashboard from './components/Dashboard.svelte';
  import DataTable from './components/DataTable.svelte';
  import Timeseries from './components/Timeseries.svelte';
  import Loader from './components/Loader.svelte';
</script>


<main>
  <Map/>
  <Dashboard/>
  <Timeseries/>
  <DataTable/>
  <WindowSelector/>
  <Loader/>

  <!-- <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" /> -->

</main>

<style>
  /* Accessing the class with "*" in front limits
    the scope to anything under this component's
    elements. */
  /* * :global(.myClass) {
    font-style: italic;
  } */

  :global(body) {
    background-color: gray;
  }
</style>
